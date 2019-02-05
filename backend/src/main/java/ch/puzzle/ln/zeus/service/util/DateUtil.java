package ch.puzzle.ln.zeus.service.util;

import java.time.LocalDate;

import static java.time.LocalDate.now;

public class DateUtil {

    public static LocalDate getEasterSunday(int year) {
        int a = year % 19,
            b = year / 100,
            c = year % 100,
            d = b / 4,
            e = b % 4,
            g = (8 * b + 13) / 25,
            h = (19 * a + b - d - g + 15) % 30,
            j = c / 4,
            k = c % 4,
            m = (a + 11 * h) / 319,
            r = (2 * e + 2 * j - k - h + m + 32) % 7,
            n = (h - m + r + 90) / 25,
            p = (h - m + r + n + 19) % 32;
        return LocalDate.of(year, n, p);
    }

    public static LocalDate getGoodFriday(int year) {
        return getEasterSunday(year).minusDays(2);
    }

    public static LocalDate getEasterMonday(int year) {
        return getEasterSunday(year).plusDays(1);
    }

    public static LocalDate getAscensionDay(int year) {
        return getEasterSunday(year).plusDays(39);
    }

    public static LocalDate getWhitMonday(int year) {
        return getEasterSunday(year).plusDays(50);
    }

    public static boolean areLocalDatesSameDayAndMonth(LocalDate first, LocalDate second) {
        return equalIgnoreYear(first, second);
    }

    public static boolean equalIgnoreYear(LocalDate a, LocalDate b) {
        return a.getMonth() == b.getMonth() && a.getDayOfMonth() == b.getDayOfMonth();
    }
}
