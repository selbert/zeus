package ch.puzzle.ln.pos.service.processors;

import ch.puzzle.ln.pos.config.ApplicationProperties;
import ch.puzzle.ln.pos.service.InvoiceEvent;
import ch.puzzle.ln.pos.service.TwitterService;
import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

@Service
public class TweetOrderProcessor implements ApplicationListener<InvoiceEvent> {

    private static final Logger LOG = LoggerFactory.getLogger(TweetOrderProcessor.class);

    private final ApplicationProperties properties;
    private final TwitterService twitterService;

    public TweetOrderProcessor(ApplicationProperties properties, TwitterService twitterService) {
        this.properties = properties;
        this.twitterService = twitterService;
    }

    @Override
    public void onApplicationEvent(InvoiceEvent event) {
        if (!properties.getTwitter().isProcessorEnabled()) {
            LOG.info("Sending tweets is disabled by configuration.");
            return;
        }

        InvoiceDTO invoice = event.getInvoice();

        // Make sure we only send an e-mail if the invoice has been settled
        // for the first time.
        if (invoice.isSettled() && event.isFirstSettleEvent()) {
            twitterService.sendTweet(invoice);
        }
    }
}
