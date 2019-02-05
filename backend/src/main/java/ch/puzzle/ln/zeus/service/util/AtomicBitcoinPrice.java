package ch.puzzle.ln.zeus.service.util;

import java.util.concurrent.atomic.AtomicLong;

import static java.lang.Double.doubleToLongBits;
import static java.lang.Double.longBitsToDouble;

public class AtomicBitcoinPrice {
    private AtomicLong bits;

    public AtomicBitcoinPrice() {
        this(0f);
    }

    public AtomicBitcoinPrice(double initialValue) {
        bits = new AtomicLong(doubleToLongBits(initialValue));
    }

    public final void set(double newValue) {
        bits.set(doubleToLongBits(newValue));
    }

    public final double get() {
        return longBitsToDouble(bits.get());
    }
}
