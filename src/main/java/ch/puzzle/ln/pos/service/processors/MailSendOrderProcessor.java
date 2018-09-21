package ch.puzzle.ln.pos.service.processors;

import ch.puzzle.ln.pos.service.InvoiceEvent;
import ch.puzzle.ln.pos.service.MailService;
import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

@Service
public class MailSendOrderProcessor implements ApplicationListener<InvoiceEvent> {

    private final MailService mailService;

    public MailSendOrderProcessor(MailService mailService) {
        this.mailService = mailService;
    }

    @Override
    public void onApplicationEvent(InvoiceEvent event) {
        InvoiceDTO invoice = event.getInvoice();

        // Make sure we only send an e-mail if the invoice has been settled
        // for the first time.
        if (invoice.isSettled() && event.isFirstSettleEvent()) {
            mailService.sendOrderConfirmation(invoice);
        }
    }
}
