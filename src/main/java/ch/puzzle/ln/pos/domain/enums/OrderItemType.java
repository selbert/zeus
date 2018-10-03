package ch.puzzle.ln.pos.domain.enums;

public enum OrderItemType {
    PRODUCT_1(2.0d),
    PRODUCT_2(2.0d),
    PRODUCT_3(2.0d),
    PRODUCT_4(2.0d);

    private Double price;

    OrderItemType(Double price) {
        this.price = price;
    }

    public Double getPrice() {
        return price;
    }
}
