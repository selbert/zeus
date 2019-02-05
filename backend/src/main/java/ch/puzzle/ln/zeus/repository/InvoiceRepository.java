package ch.puzzle.ln.zeus.repository;

import ch.puzzle.ln.zeus.domain.Invoice;
import ch.puzzle.ln.zeus.domain.enums.InvoiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@SuppressWarnings("unused")
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Invoice findByHashHex(String hashHex);

    List<Invoice> findAllByInvoiceTypeAndSettledFalseAndCreationDateLessThan(InvoiceType invoiceType, Instant creationDate);
}
