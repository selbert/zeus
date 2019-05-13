package ch.puzzle.ln.zeus.web.rest;

import ch.puzzle.ln.zeus.config.ApplicationProperties;
import ch.puzzle.ln.zeus.service.BitcoinService;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static ch.puzzle.ln.zeus.service.BitcoinService.FIELD_BUY;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/bitcoin")
@Timed
public class BitcoinResource extends AbstractHealthIndicator {

    private static final Logger LOGGER = LoggerFactory.getLogger(BitcoinResource.class);

    private final ApplicationProperties applicationProperties;
    private final BitcoinService bitcoinService;

    public BitcoinResource(ApplicationProperties applicationProperties, BitcoinService bitcoinService) {
        this.applicationProperties = applicationProperties;
        this.bitcoinService = bitcoinService;
    }

    @GetMapping(value = "")
    public ResponseEntity<Map<String, Object>> getInfo() throws Exception {
        return ok(bitcoinService.chainInfo());
    }

    @GetMapping("/price/{ticker}")
    public ResponseEntity<Object> getPrice(@PathVariable String ticker) {
        LOGGER.debug("REST request to get bitcoin price in {}", ticker);
        return ok(Collections.singletonMap(FIELD_BUY, bitcoinService.buyPricePerBitcoinIn(ticker)));
    }

    @GetMapping("/prices/stale")
    public ResponseEntity<List<String>> getStalePrices() {
        LOGGER.debug("REST request to get stale bitcoin prices");
        return ok(bitcoinService.getStalePrices());
    }

    @GetMapping("/prices/age")
    public ResponseEntity<Map<String, Long>> getPricesAge() {
        LOGGER.debug("REST request to get bitcoin prices age");
        return ok(bitcoinService.getPricesAge());
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) {
        try {
            Map<String, Object> info = bitcoinService.chainInfo();
            Double price = bitcoinService.buyPricePerBitcoinIn(applicationProperties.getCurrencyTicker());
            List<String> stalePrices = bitcoinService.getStalePrices();
            Map<String, Long> pricesAges = bitcoinService.getPricesAge();

            if (info == null || !stalePrices.isEmpty()) {
                builder.down();
                return;
            }

            builder
                .withDetail("price", price)
                .withDetail("stalePrices", stalePrices)
                .withDetail("pricesAge", pricesAges)
                .withDetail("blockHeight", info.get("blocks"))
                .withDetail("blockHash", info.get("bestblockhash"))
                .up();
        } catch (Exception e) {
            LOGGER.error("Error in bitcoin health check.", e);
            builder.down(e);
        }
    }
}
