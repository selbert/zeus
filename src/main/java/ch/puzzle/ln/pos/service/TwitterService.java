package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TwitterService {

    private static final Logger LOG = LoggerFactory.getLogger(TwitterService.class);

    public void sendTweet(InvoiceDTO invoice) {
        LOG.info("Would send tweet for invoice {}!", invoice);
    }
}
