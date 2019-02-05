package ch.puzzle.ln.zeus.service;

import ch.puzzle.ln.zeus.config.ApplicationProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.junit.Assert.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class ShopServiceTest {

    @Mock
    private DynamicConfigurationService dynamicConfigurationService;

    private final ApplicationProperties applicationProperties = new ApplicationProperties();
    private final HolidaysService holidaysService = new HolidaysService();
    private final OpeningHoursService openingHoursService = new OpeningHoursService(applicationProperties);
    private ShopService shopService;

    @Before
    public void setUp() {
        shopService = new ShopService(dynamicConfigurationService, holidaysService, openingHoursService);
    }

    @Test
    public void shouldGetDelayMinutes() {
        //when
        List<Integer> delayMinutes = shopService.getDelayMinutes();

        //then
        assertTrue(delayMinutes.size() > 0);
    }

}
