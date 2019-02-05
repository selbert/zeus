package ch.puzzle.ln.zeus.service;

import ch.puzzle.ln.zeus.domain.DynamicConfiguration;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static ch.puzzle.ln.zeus.service.DynamicConfigurationService.KEY_SHOP_ACTIVE;
import static ch.puzzle.ln.zeus.service.DynamicConfigurationService.KEY_SHOP_OVERRIDE;
import static java.time.LocalDateTime.now;

@Service
public class ShopService {

    private static final int DELAY_INTERVAL_MINUTES = 15;
    private static final int MAX_INTERVAL_PERIODS = 4 * 10; // 10 hours = 15 minutes * 4 * 10

    private final DynamicConfigurationService dynamicConfigurationService;
    private final HolidaysService holidaysService;
    private final OpeningHoursService openingHoursService;

    public ShopService(DynamicConfigurationService dynamicConfigurationService, HolidaysService holidaysService, OpeningHoursService openingHoursService) {
        this.dynamicConfigurationService = dynamicConfigurationService;
        this.holidaysService = holidaysService;
        this.openingHoursService = openingHoursService;
    }

    public boolean isClosed() {
        // disabling the shop has highest priority
        if (isDisabled()) {
            return true;
        }

        // if the shop is not disabled and opening hours are overridden, we're always open,
        // no matter the day or hour
        if (areOpeningHoursOverridden()) {
            return false;
        }

        // otherwise we check the day and hour
        return holidaysService.isPublicHoliday(now()) || !openingHoursService.isOpenAt(now());
    }

    public boolean isDisabled() {
        DynamicConfiguration config = dynamicConfigurationService.getByKey(KEY_SHOP_ACTIVE);
        return config == null || !config.getValueBoolean();
    }

    public boolean areOpeningHoursOverridden() {
        DynamicConfiguration config = dynamicConfigurationService.getByKey(KEY_SHOP_OVERRIDE);
        return config != null && config.getValueBoolean();
    }

    public boolean isShopOpenInMinutes(int delayMinutes) {
        LocalDateTime pickupTime = LocalDateTime.now().plusMinutes(delayMinutes);
        return openingHoursService.isOpenAt(pickupTime);
    }

    public List<Integer> getDelayMinutes() {
        return IntStream.range(0, MAX_INTERVAL_PERIODS)
            .map(period -> (period + 1) * DELAY_INTERVAL_MINUTES)
            .filter(this::isShopOpenInMinutes)
            .boxed()
            .collect(Collectors.toList());
    }
}
