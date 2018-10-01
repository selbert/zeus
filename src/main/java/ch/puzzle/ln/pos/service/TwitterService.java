package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.auth.RequestToken;

@Service
public class TwitterService {

    private static final Logger LOG = LoggerFactory.getLogger(TwitterService.class);

    private final Twitter twitter;

    public TwitterService() {
        twitter = new TwitterFactory().getInstance();
    }

    public void sendTweet(InvoiceDTO invoice) {
        LOG.info("Would send tweet!");
    }
}
