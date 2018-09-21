package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.springframework.context.ApplicationEvent;

public class InvoiceEvent extends ApplicationEvent {

    private InvoiceDTO invoice;
    private boolean firstSettleEvent;

    public InvoiceEvent(Object source, InvoiceDTO invoice, boolean firstSettleEvent) {
        super(source);
        this.invoice = invoice;
        this.firstSettleEvent = firstSettleEvent;
    }

    public InvoiceDTO getInvoice() {
        return invoice;
    }

    public boolean isFirstSettleEvent() {
        return firstSettleEvent;
    }
}
