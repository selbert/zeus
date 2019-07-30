package ch.puzzle.ln.zeus.web.rest.vm;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class BeerTapVM {

    @NotNull
    private String orderName;
    private Double amount;
    private boolean amountInSats;
    private String memoPrefix;

    @NotEmpty
    private List<OrderItemVM> orderItems = new ArrayList<>();

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public boolean isAmountInSats() {
        return amountInSats;
    }

    public void setAmountInSats(boolean amountInSats) {
        this.amountInSats = amountInSats;
    }

    public List<OrderItemVM> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemVM> orderItems) {
        this.orderItems = orderItems;
    }

    public String getMemoPrefix() {
        return memoPrefix;
    }

    public void setMemoPrefix(String memoPrefix) {
        this.memoPrefix = memoPrefix;
    }
}
