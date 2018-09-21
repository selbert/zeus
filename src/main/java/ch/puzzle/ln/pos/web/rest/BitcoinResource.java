package ch.puzzle.ln.pos.web.rest;

import ch.puzzle.ln.pos.config.ApplicationProperties;
import ch.puzzle.ln.pos.service.BitcoinService;
import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/bitcoin")
public class BitcoinResource extends AbstractHealthIndicator {

    private static final Logger LOG = LoggerFactory.getLogger(BitcoinResource.class);

    private final ApplicationProperties applicationProperties;
    private final BitcoinService bitcoinService;

    public BitcoinResource(ApplicationProperties applicationProperties, BitcoinService bitcoinService) {
        this.applicationProperties = applicationProperties;
        this.bitcoinService = bitcoinService;
    }

    @GetMapping(value = "")
    @Timed
    public ResponseEntity<Map<String, Object>> getInfo() throws Exception {
        return ok(bitcoinService.chainInfo());
    }

    @GetMapping("/price/{ticker}")
    @Timed
    public ResponseEntity<Object> getPrice(@PathVariable String ticker) throws Exception {
        LOG.debug("REST request to get bitcoin price in {}", ticker);
        return ok(bitcoinService.pricePerBitcoinIn(ticker));
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        try {
            Map<String, Object> info = bitcoinService.chainInfo();
            Object price = bitcoinService.pricePerBitcoinIn(applicationProperties.getCurrencyTicker());

            if (info == null || price == null) {
                builder.down();
                return;
            }

            builder
                .withDetail("price", price)
                .withDetail("blockHeight", info.get("blocks"))
                .withDetail("blockHash", info.get("bestblockhash"))
                .up();
        } catch (Exception e) {
            builder.down(e);
        }
    }
}
