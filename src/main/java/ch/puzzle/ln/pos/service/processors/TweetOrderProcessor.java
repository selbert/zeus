package ch.puzzle.ln.pos.service.processors;

import ch.puzzle.ln.pos.config.ApplicationProperties;
import ch.puzzle.ln.pos.config.ApplicationProperties.Twitter;
import ch.puzzle.ln.pos.service.InvoiceEvent;
import ch.puzzle.ln.pos.service.MailService;
import ch.puzzle.ln.pos.service.TwitterService;
import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

@Service
public class TweetOrderProcessor implements ApplicationListener<InvoiceEvent> {

    private final ApplicationProperties properties;
    private final TwitterService twitterService;

    public TweetOrderProcessor(ApplicationProperties properties, TwitterService twitterService) {
        this.properties = properties;
        this.twitterService = twitterService;
    }

    @Override
    public void onApplicationEvent(InvoiceEvent event) {
        if (!properties.getTwitter().isProcessorEnabled()) {
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
