package ch.puzzle.ln.zeus.web.websocket;

import ch.puzzle.ln.zeus.service.InvoiceEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class InvoiceWSService implements ApplicationListener<InvoiceEvent> {

    private final SimpMessageSendingOperations messagingTemplate;

    public InvoiceWSService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onApplicationEvent(InvoiceEvent event) {
        messagingTemplate.convertAndSend("/topic/invoice", event.getInvoice());
    }
}
