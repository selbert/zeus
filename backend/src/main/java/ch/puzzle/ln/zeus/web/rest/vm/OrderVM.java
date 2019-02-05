package ch.puzzle.ln.zeus.web.rest.vm;

import ch.puzzle.ln.zeus.domain.enums.InvoiceType;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class OrderVM {

    @NotNull
    private String orderName;
    private String pickupLocation;
    private Integer pickupDelayMinutes;
    private InvoiceType invoiceType;
    private String memoPrefix;

    @NotEmpty
    private List<OrderItemVM> orderItems = new ArrayList<>();

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
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

    public List<OrderItemVM> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemVM> orderItems) {
        this.orderItems = orderItems;
    }

    public InvoiceType getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(InvoiceType invoiceType) {
        this.invoiceType = invoiceType;
    }

    public String getMemoPrefix() {
        return memoPrefix;
    }

    public void setMemoPrefix(String memoPrefix) {
        this.memoPrefix = memoPrefix;
    }

    public static class OrderItemVM {

        private String productKey;
        private Integer count;
        private List<String> options = new ArrayList<>();

        public String getProductKey() {
            return productKey;
        }

        public void setProductKey(String productKey) {
            this.productKey = productKey;
        }

        public Integer getCount() {
            return count;
        }

        public void setCount(Integer count) {
            this.count = count;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }
    }
}
