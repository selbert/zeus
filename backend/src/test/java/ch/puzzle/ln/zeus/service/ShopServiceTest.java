package ch.puzzle.ln.zeus.service;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Test;

public class ShopServiceTest {

	@Test
	public void shouldGetDelayMinutes() {
		// given
		ShopService shopService = new ShopService(null);
		//when
		List<Integer> delayMinutes = shopService.getDelayMinutes();
		//then
		assertTrue(delayMinutes.size()>0);
	}

}
