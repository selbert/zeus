package ch.puzzle.ln.pos.web.rest.vm;

import javax.validation.constraints.NotNull;

public class DonationVM {

    @NotNull
    private String memoPrefix;

    private Integer amount;

    public String getMemoPrefix() {
        return memoPrefix;
    }

    public void setMemoPrefix(String memoPrefix) {
        this.memoPrefix = memoPrefix;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
}
