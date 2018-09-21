package ch.puzzle.ln.pos.service.mapper;

import ch.puzzle.ln.pos.domain.Invoice;
import ch.puzzle.ln.pos.service.dto.InvoiceDTO;
import org.mapstruct.Mapper;

import static org.mapstruct.ReportingPolicy.IGNORE;

/**
 * Mapper for the entity Invoice and its DTO InvoiceDTO.
 */
@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = IGNORE)
public interface InvoiceMapper extends EntityMapper<InvoiceDTO, Invoice> {

    default Invoice fromId(Long id) {
        if (id == null) {
            return null;
        }
        Invoice invoice = new Invoice();
        invoice.setId(id);
        return invoice;
    }
}
