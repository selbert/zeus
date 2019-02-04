package ch.puzzle.ln.zeus.domain;

import ch.puzzle.ln.zeus.domain.enums.OrderItemType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static javax.persistence.FetchType.EAGER;

@Entity
@Table(name = "order_item")
public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "item_type")
    private OrderItemType itemType;

    @NotNull
    @Column(name = "count")
    private Integer count;

    @ElementCollection(fetch = EAGER)
    @CollectionTable(name = "order_item_option")
    private List<String> options = new ArrayList<>();

    public OrderItem() {

    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public OrderItemType getItemType() {
        return itemType;
    }

    public void setItemType(OrderItemType itemType) {
        this.itemType = itemType;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Double getTotal() {
        return itemType.getPrice() * count.doubleValue();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        OrderItem orderItem = (OrderItem) o;
        return Objects.equals(id, orderItem.id) &&
            Objects.equals(count, orderItem.count) &&
            itemType == orderItem.itemType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, count, itemType);
    }
}
