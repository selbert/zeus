package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.domain.DynamicConfiguration;
import ch.puzzle.ln.pos.service.util.DateUtil;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static java.time.LocalDate.now;
import static java.time.LocalDate.of;
import static java.util.Arrays.asList;

@Service
public class ShopService {

    private static final int DELAY_START = 15;
    private static final LocalTime OPENING_HOUR = LocalTime.of(7, 30);
    private static final LocalTime CLOSING_HOUR = LocalTime.of(23, 59);
    private static final List<LocalDate> PUBLIC_HOLIDAYS = asList(
        of(1970, 1, 1),     // first of January
        of(1970, 1, 2),     // second of January
        of(1970, 8, 1),     // first of august
        of(1970, 12, 25),   // first day of Christmas
        of(1970, 12, 26)    // first day of Christmas
    );

    private final DynamicConfigurationService dynamicConfigurationService;

    public ShopService(DynamicConfigurationService dynamicConfigurationService) {
        this.dynamicConfigurationService = dynamicConfigurationService;
    }

    public boolean isDisabled() {
        DynamicConfiguration config = dynamicConfigurationService.getByKey(DynamicConfigurationService.KEY_SHOP_ACTIVE);
        return config == null || !config.getValueBoolean();
    }

    public boolean isPublicHoliday() {
        return isStaticDateHoliday() || isGoodFriday() || isEasterMonday() || isAscensionDay() || isWhitMonday();
    }

    public boolean isOutsideOpeningHours() {
        if (now().getDayOfWeek() == DayOfWeek.SUNDAY) {
            return true;
        }
        return LocalTime.now().isBefore(OPENING_HOUR) || LocalTime.now().isAfter(CLOSING_HOUR);
    }

    public boolean pickupDelayMinutesAfterOpening(int delayMinutes) {
        return LocalTime.now().plusMinutes(delayMinutes).isAfter(CLOSING_HOUR);
    }

    public List<Integer> getDelayMinutes() {
        List<Integer> delays = new ArrayList<>();
        int delay = DELAY_START;
        while (!pickupDelayMinutesAfterOpening(delay)) {
            delays.add(delay);
            delay += DELAY_START;
        }
        return delays;
    }

    private boolean isGoodFriday() {
        return DateUtil.isTodayIgnoreYear(DateUtil.getGoodFriday(now().getYear()));
    }

    private boolean isEasterMonday() {
        return DateUtil.isTodayIgnoreYear(DateUtil.getEasterMonday(now().getYear()));
    }

    private boolean isAscensionDay() {
        return DateUtil.isTodayIgnoreYear(DateUtil.getAscensionDay(now().getYear()));
    }

    private boolean isWhitMonday() {
        return DateUtil.isTodayIgnoreYear(DateUtil.getWhitMonday(now().getYear()));
    }

    private boolean isStaticDateHoliday() {
        return PUBLIC_HOLIDAYS.stream().anyMatch(DateUtil::isTodayIgnoreYear);
    }
}
