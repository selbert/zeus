package ch.puzzle.ln.zeus.service;

public interface InvoiceHandler {

    void handleInvoiceUpdated(String hashHex, org.lightningj.lnd.wrapper.message.Invoice invoice);


}
