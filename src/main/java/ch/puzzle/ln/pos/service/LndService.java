package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.config.ApplicationProperties;
import ch.puzzle.ln.pos.config.ApplicationProperties.Lnd;
import ch.puzzle.ln.pos.service.util.ConvertUtil;
import io.grpc.netty.GrpcSslContexts;
import io.grpc.stub.StreamObserver;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.SslProvider;
import org.lightningj.lnd.wrapper.AsynchronousLndAPI;
import org.lightningj.lnd.wrapper.StatusException;
import org.lightningj.lnd.wrapper.SynchronousLndAPI;
import org.lightningj.lnd.wrapper.ValidationException;
import org.lightningj.lnd.wrapper.message.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Component
public class LndService implements StreamObserver<org.lightningj.lnd.wrapper.message.Invoice> {

    private static final Logger LOG = LoggerFactory.getLogger(LndService.class);
    private static final long CONNECTION_RETRY_TIMEOUT = 5000;
    private static final int MAX_RETRIES = 5;

    private final ResourceLoader resourceLoader;
    private final ApplicationProperties applicationProperties;
    private final AsynchronousLndAPI asyncApiInvoice;
    private final SynchronousLndAPI syncApiReadOnly;
    private final SynchronousLndAPI syncApiInvoice;
    private final InvoiceSubscription invoiceSubscription;
    private final Set<InvoiceHandler> invoiceHandlers = new HashSet<>();

    private int retries = 0;

    public LndService(ResourceLoader resourceLoader, ApplicationProperties applicationProperties) throws Exception {
        this.resourceLoader = resourceLoader;
        this.applicationProperties = applicationProperties;
        Lnd lnd = applicationProperties.getLnd();
        asyncApiInvoice = new AsynchronousLndAPI(
            lnd.getHost(),
            lnd.getPort(),
            getSslContext(),
            lnd.getInvoiceMacaroonContext()
        );
        syncApiInvoice = new SynchronousLndAPI(
            lnd.getHost(),
            lnd.getPort(),
            getSslContext(),
            lnd.getInvoiceMacaroonContext()
        );
        syncApiReadOnly = new SynchronousLndAPI(
            lnd.getHost(),
            lnd.getPort(),
            getSslContext(),
            lnd.getReadonlyMacaroonContext()
        );
        invoiceSubscription = new InvoiceSubscription();
        asyncApiInvoice.subscribeInvoices(invoiceSubscription, this);
    }

    public void addInvoiceHandler(InvoiceHandler handler) {
        invoiceHandlers.add(handler);
    }

    public void removeInvoiceHandler(InvoiceHandler handler) {
        invoiceHandlers.remove(handler);
    }

    public GetInfoResponse getInfo() throws StatusException, ValidationException {
        LOG.info("getInfo called");
        return syncApiReadOnly.getInfo();
    }

    public ListChannelsResponse getChannels() throws StatusException, ValidationException {
        LOG.info("getChannels called");
        return syncApiReadOnly.listChannels(true, false, true, false);
    }

    public NodeInfo getNodeInfo(String nodeId) throws StatusException, ValidationException {
        LOG.info("getNodeInfo called with nodeId={}", nodeId);
        return syncApiReadOnly.getNodeInfo(nodeId);
    }

    public AddInvoiceResponse addInvoice(Invoice invoice) throws StatusException, ValidationException {
        LOG.info("addInvoice called with memo={}, amount={}", invoice.getMemo(), invoice.getValue());
        return syncApiInvoice.addInvoice(invoice);
    }

    public Invoice lookupInvoice(String hashHex) throws StatusException, ValidationException {
        LOG.info("lookupInvoice called with {}", hashHex);
        PaymentHash paymentHash = new PaymentHash();
        byte[] rHash = ConvertUtil.hexToBytes(hashHex);
        paymentHash.setRHash(rHash);
        return syncApiInvoice.lookupInvoice(paymentHash);
    }

    @Override
    public void onNext(org.lightningj.lnd.wrapper.message.Invoice invoice) {
        String invoiceHex = ConvertUtil.bytesToHex(invoice.getRHash());
        LOG.info("Received update on subscription for {}.", invoiceHex);
        invoiceHandlers.forEach(h -> h.handleInvoiceUpdated(invoiceHex, invoice));
    }

    @Override
    public void onError(Throwable t) {
        LOG.error("Subscription for listening to invoices failed! Trying again in 5 seconds", t);
        try {
            Thread.sleep(CONNECTION_RETRY_TIMEOUT);
            retries++;
            asyncApiInvoice.subscribeInvoices(invoiceSubscription, this);
            retries = 0;
        } catch (InterruptedException e) {
            LOG.error("Couldn't wait 5 seconds!", e);
        } catch (StatusException | ValidationException e) {
            LOG.error("Couldn't subscribe to invoices!", e);
            if (retries < MAX_RETRIES) {
                onError(e);
            }
        }
    }

    @Override
    public void onCompleted() {
        LOG.info("Subscription for listening to invoices completed.");
    }

    private SslContext getSslContext() throws IOException {
        return GrpcSslContexts
            .configure(SslContextBuilder.forClient(), SslProvider.OPENSSL)
            .trustManager(resourceLoader.getResource(applicationProperties.getLnd().getCertPath()).getInputStream())
            .build();
    }
}
