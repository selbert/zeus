package ch.puzzle.ln.pos.web.websocket;

import ch.puzzle.ln.pos.service.ShopEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ShopWSService implements ApplicationListener<ShopEvent> {

    private final SimpMessageSendingOperations messagingTemplate;

    public ShopWSService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onApplicationEvent(ShopEvent event) {
        String destination = "/topic/shop/" + event.getType().name().toLowerCase();
        if (event.getPayload() == null) {
            messagingTemplate.convertAndSend(destination, "null");
        } else {
            messagingTemplate.convertAndSend(destination, event.getPayload());
        }
    }
}
