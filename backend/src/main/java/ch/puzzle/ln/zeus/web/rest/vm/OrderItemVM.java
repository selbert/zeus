package ch.puzzle.ln.zeus.web.rest.vm;

import java.util.ArrayList;
import java.util.List;

public class OrderItemVM {

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
