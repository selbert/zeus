package ch.puzzle.ln.zeus.domain;

import java.time.LocalTime;

public class DailyOpeningHours {

    private LocalTime openingHour;
    private LocalTime closingHour;

    public DailyOpeningHours(LocalTime openingHour, LocalTime closingHour) {
        this.openingHour = openingHour;
        this.closingHour = closingHour;
    }

    public LocalTime getOpeningHour() {
        return openingHour;
    }

    public LocalTime getClosingHour() {
        return closingHour;
    }
}
