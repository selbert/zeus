package ch.puzzle.ln.pos.service.util;

import org.junit.Test;

import java.time.LocalDate;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class DateUtilTest {

    @Test
    public void shouldCalculateEaster() {
        assertThat(DateUtil.getGoodFriday(2018), is(LocalDate.of(2018, 3, 30)));
        assertThat(DateUtil.getEasterSunday(2018), is(LocalDate.of(2018, 4, 1)));
        assertThat(DateUtil.getEasterMonday(2018), is(LocalDate.of(2018, 4, 2)));
        assertThat(DateUtil.getAscensionDay(2018), is(LocalDate.of(2018, 5, 10)));
        assertThat(DateUtil.getWhitMonday(2018), is(LocalDate.of(2018, 5, 21)));

        assertThat(DateUtil.getGoodFriday(2019), is(LocalDate.of(2019, 4, 19)));
        assertThat(DateUtil.getEasterSunday(2019), is(LocalDate.of(2019, 4, 21)));
        assertThat(DateUtil.getEasterMonday(2019), is(LocalDate.of(2019, 4, 22)));
        assertThat(DateUtil.getAscensionDay(2019), is(LocalDate.of(2019, 5, 30)));
        assertThat(DateUtil.getWhitMonday(2019), is(LocalDate.of(2019, 6, 10)));
    }
}
