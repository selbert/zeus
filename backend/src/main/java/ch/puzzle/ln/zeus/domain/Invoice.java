package ch.puzzle.ln.zeus.domain;

import ch.puzzle.ln.zeus.domain.enums.InvoiceType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.EAGER;

@Entity
@Table(name = "invoice")
public class Invoice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "reference_id")
    private String referenceId;

    @NotNull
    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;

    @Column(name = "hash_hex")
    private String hashHex;

    @Column(name = "preimage_hex")
    private String preimageHex;

    @NotNull
    @Column(name = "amount")
    private Long amount;

    @NotNull
    @Column(name = "amount_chf")
    private Double amountChf;

    @NotNull
    @Column(name = "exchange_rate")
    private Double exchangeRate;

    @NotNull
    @Column(name = "order_name", length = 255)
    private String orderName;

    @Column(name = "settled")
    private Boolean settled;

    @Column(name = "creation_date")
    private Instant creationDate;

    @Column(name = "settle_date")
    private Instant settleDate;

    @Column(name = "payment_request", columnDefinition = "TEXT")
    private String paymentRequest;

    @OneToMany(fetch = EAGER, cascade = ALL, mappedBy = "invoice")
    private Set<OrderItem> orderItems = new HashSet<>();

    @Column(name = "invoice_type")
    @Enumerated(EnumType.STRING)
    private InvoiceType invoiceType;

    @Column(name = "pickup_location")
    private String pickupLocation;

    @Column(name = "pickup_delay_minutes")
    private Integer pickupDelayMinutes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public Invoice referenceId(String referenceId) {
        this.referenceId = referenceId;
        return this;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getReferenceIdShort() {
        return referenceId != null ? "#" + referenceId.substring(0, 4) : null;
    }

    public String getHashHex() {
        return hashHex;
    }

    public void setHashHex(String hashHex) {
        this.hashHex = hashHex;
    }

    public String getPreimageHex() {
        return preimageHex;
    }

    public void setPreimageHex(String preimageHex) {
        this.preimageHex = preimageHex;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Double getAmountChf() {
        return amountChf;
    }

    public void setAmountChf(Double amountChf) {
        this.amountChf = amountChf;
    }

    public Double getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(Double exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public Boolean isSettled() {
        return settled;
    }

    public void setSettled(Boolean settled) {
        this.settled = settled;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getSettleDate() {
        return settleDate;
    }

    public void setSettleDate(Instant settleDate) {
        this.settleDate = settleDate;
    }

    public String getPaymentRequest() {
        return paymentRequest;
    }

    public void setPaymentRequest(String paymentRequest) {
        this.paymentRequest = paymentRequest;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public InvoiceType getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(InvoiceType invoiceType) {
        this.invoiceType = invoiceType;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public Integer getPickupDelayMinutes() {
        return pickupDelayMinutes;
    }

    public void setPickupDelayMinutes(Integer pickupDelayMinutes) {
        this.pickupDelayMinutes = pickupDelayMinutes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Invoice invoice = (Invoice) o;
        if (invoice.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), invoice.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Invoice{" +
            "id=" + getId() +
            ", referenceId='" + getReferenceId() + "'" +
            ", memo='" + getMemo() + "'" +
            ", hashHex='" + getHashHex() + "'" +
            ", preimageHex='" + getPreimageHex() + "'" +
            ", amount=" + getAmount() +
            ", amountChf=" + getAmountChf() +
            ", exchangeRate=" + getExchangeRate() +
            ", settled='" + isSettled() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            ", settleDate='" + getSettleDate() + "'" +
            ", paymentRequest='" + getPaymentRequest() + "'" +
            "}";
    }
}
