package ch.puzzle.ln.zeus.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static ch.puzzle.ln.zeus.service.util.DateUtil.*;
import static java.time.LocalDate.of;
import static java.util.Arrays.asList;

@Service
public class HolidaysService {
    private static final List<LocalDate> PUBLIC_HOLIDAYS = asList(
        of(1970, 1, 1),     // first of January
        of(1970, 1, 2),     // second of January
        of(1970, 8, 1),     // first of august
        of(1970, 12, 25),   // first day of Christmas
        of(1970, 12, 26)    // first day of Christmas
    );

    public boolean isPublicHoliday(LocalDateTime localDateTime) {
        return isStaticDateHoliday(localDateTime) || isGoodFriday(localDateTime) || isEasterMonday(localDateTime) || isAscensionDay(localDateTime) || isWhitMonday(localDateTime);
    }

    private boolean isGoodFriday(LocalDateTime localDateTime) {
        return areLocalDatesSameDayAndMonth(localDateTime.toLocalDate(), getGoodFriday(localDateTime.getYear()));
    }

    private boolean isEasterMonday(LocalDateTime localDateTime) {
        return areLocalDatesSameDayAndMonth(localDateTime.toLocalDate(), getEasterMonday(localDateTime.getYear()));
    }

    private boolean isAscensionDay(LocalDateTime localDateTime) {
        return areLocalDatesSameDayAndMonth(localDateTime.toLocalDate(), getAscensionDay(localDateTime.getYear()));
    }

    private boolean isWhitMonday(LocalDateTime localDateTime) {
        return areLocalDatesSameDayAndMonth(localDateTime.toLocalDate(), getWhitMonday(localDateTime.getYear()));
    }

    private boolean isStaticDateHoliday(LocalDateTime localDateTime) {
        return PUBLIC_HOLIDAYS.stream().anyMatch(holiday -> areLocalDatesSameDayAndMonth(localDateTime.toLocalDate(), holiday));
    }
}
