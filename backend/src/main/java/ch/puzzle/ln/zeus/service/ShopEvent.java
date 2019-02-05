package ch.puzzle.ln.zeus.service;

import org.springframework.context.ApplicationEvent;

public class ShopEvent extends ApplicationEvent {

    private ShopEventType type;
    private Object payload;

    public ShopEvent(Object source, ShopEventType type) {
        this(source, type, null);
    }

    public ShopEvent(Object source, ShopEventType type, Object payload) {
        super(source);
        this.type = type;
        this.payload = payload;
    }

    public ShopEventType getType() {
        return type;
    }

    public Object getPayload() {
        return payload;
    }
}
