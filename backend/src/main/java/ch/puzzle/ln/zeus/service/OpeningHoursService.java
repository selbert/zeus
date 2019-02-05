package ch.puzzle.ln.zeus.service;

import ch.puzzle.ln.zeus.config.ApplicationProperties;
import ch.puzzle.ln.zeus.domain.DailyOpeningHours;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class OpeningHoursService {

    private final ApplicationProperties applicationProperties;
    private final Map<DayOfWeek, Optional<DailyOpeningHours>> weekdays;

    public OpeningHoursService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
        this.weekdays = this.applicationProperties.getShop().getWeeklyOpeningHours();
    }

    /**
     * @return null if the shop is closed on a given weekday
     */
    public Optional<DailyOpeningHours> getOpeningHours(LocalDateTime dateTime) {
        return weekdays.get(dateTime.getDayOfWeek());
    }

    public boolean isOpenAt(LocalDateTime dateDateTime) {
        boolean isOpen = getOpeningHours(dateDateTime)
            .filter(openingHours -> dateDateTime.toLocalTime().isAfter(openingHours.getOpeningHour()))
            .filter(openingHours -> dateDateTime.toLocalTime().isBefore(openingHours.getClosingHour()))
            .isPresent();

        return isOpen;
    }
}
