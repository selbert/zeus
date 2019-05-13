package ch.puzzle.ln.zeus.service;

import ch.puzzle.ln.zeus.config.ApplicationProperties;
import ch.puzzle.ln.zeus.config.ApplicationProperties.Bitcoin;
import ch.puzzle.ln.zeus.service.util.AtomicBitcoinPrice;
import ch.puzzle.ln.zeus.web.rest.errors.InternalServerErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URISyntaxException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Service
public class BitcoinService {

    private static final Logger log = LoggerFactory.getLogger(BitcoinService.class);

    private static final Long SATOSHIS_IN_BTC = 100000000L;
    public static final String FIELD_BUY = "buy";
    private static final String FIELD_BID = "bid";
    private static final String DISABLED_VALUE = "disabled";

    private final Map<String, AtomicBitcoinPrice> lastBitcoinBuyPriceMap = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastBitcoinPriceUpdateMap = new ConcurrentHashMap<>();

    private final Bitcoin bitcoinProperties;
    private final RestTemplate tickerTemplate;

    public BitcoinService(ApplicationProperties applicationProperties) {
        this.bitcoinProperties = applicationProperties.getBitcoin();
        tickerTemplate = new RestTemplateBuilder()
            .setConnectTimeout(bitcoinProperties.getConnectTimeout())
            .setReadTimeout(bitcoinProperties.getReadTimeout())
            .rootUri(bitcoinProperties.getTickerUrl())
            .build();

        try {
            updateBitcoinPrice(applicationProperties.getCurrencyTicker());
        } catch (Exception e) {
            log.error("Unable to initialize bitcoin price", e);
        }
    }

    public Map<String, Object> chainInfo() throws Exception {
        RestTemplate tpl = new RestTemplate();
        if (Objects.equals(bitcoinProperties.getRestUrl(), DISABLED_VALUE)) {
            Map<String, Object> disabled = new HashMap<>();
            disabled.put("blocks", "<rest URL check disabled>");
            disabled.put("bestblockhash", "<rest URL check disabled>");
            return disabled;
        }
        RequestEntity<Void> request = RequestEntity.get(bitcoinProperties.getRestUri()).accept(APPLICATION_JSON).build();
        ResponseEntity<Map<String, Object>> parsed = tpl.exchange(request, new InfoResponseType());
        if (parsed.getStatusCode().is2xxSuccessful() && parsed.getBody() != null) {
            return parsed.getBody();
        }
        return null;
    }

    public Double buyPricePerBitcoinIn(String ticker) {
        return Optional.ofNullable(lastBitcoinBuyPriceMap.get(ticker))
            .map(AtomicBitcoinPrice::get)
            .orElseGet(() -> {
                log.warn("could not parse bitcoin price from cache");
                return updateBitcoinPrice(ticker);
            });
    }

    public List<String> getStalePrices() {
        return lastBitcoinPriceUpdateMap.entrySet().stream()
            .filter(lastUpdate -> lastUpdate.getValue().isBefore(LocalDateTime.now().minusMinutes(10L)))
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }


    public Map<String, Long> getPricesAge() {
        return lastBitcoinPriceUpdateMap.entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                e -> Duration.between(e.getValue(), LocalDateTime.now()).toMillis())
            );
    }

    Map<String, Object> pricePerBitcoinIn(String ticker) {
        try {
            return primaryTickerPrice(ticker);
        } catch (Exception e) {
            log.warn("Primary ticker URL failed, trying secondary!", e);
            return secondaryTickerPrice();
        }
    }

    private Map<String, Object> primaryTickerPrice(String ticker) {
        try {
            RequestEntity<Void> request = RequestEntity.get(bitcoinProperties.getTickerUri()).accept(APPLICATION_JSON).build();
            ResponseEntity<Map<String, Map<String, Object>>> parsed = tickerTemplate.exchange(request, new TickerResponseType());
            if (parsed.getStatusCode().is2xxSuccessful() && parsed.getBody() != null) {
                return parsed.getBody().get(ticker);
            } else {
                throw new InternalServerErrorException("response code was not 2xx!");
            }
        } catch (URISyntaxException e) {
            throw new InternalServerErrorException("could not call ticker URI");
        }
    }

    private Map<String, Object> secondaryTickerPrice() {
        try {
            RequestEntity<Void> request = RequestEntity.get(bitcoinProperties.getTickerBackupUri()).accept(APPLICATION_JSON).build();
            ResponseEntity<Map<String, Object>> parsed = tickerTemplate.exchange(request, new InfoResponseType());
            if (parsed.getStatusCode().is2xxSuccessful() && parsed.getBody() != null) {
                Map<String, Object> response = parsed.getBody();
                if (response != null && response.containsKey(FIELD_BID)) {
                    response.put(FIELD_BUY, response.get(FIELD_BID));
                }
                return response;
            } else {
                throw new InternalServerErrorException("response code was not 2xx!");
            }
        } catch (URISyntaxException e) {
            throw new InternalServerErrorException("could not call ticker URI");
        }
    }

    @Scheduled(cron = "0 * * * * *")
    public void updateBitcoinPrices() {
        lastBitcoinBuyPriceMap.forEach((ticker, price) -> updateBitcoinPrice(ticker));
    }

    private Double updateBitcoinPrice(String currencyTicker) {
        Double price = fetchBuyPricePerBitcoinIn(currencyTicker);
        updateBitcoinPriceCache(currencyTicker, price);
        return price;
    }

    private Double fetchBuyPricePerBitcoinIn(String ticker) {
        Map<String, Object> price = pricePerBitcoinIn(ticker);
        if (price == null || !price.containsKey(FIELD_BUY)) {
            throw new InternalServerErrorException("could not read bitcoin price from ticker API");
        }
        try {
            return Double.parseDouble(price.get(FIELD_BUY).toString());
        } catch (NumberFormatException e) {
            throw new InternalServerErrorException("could not parse bitcoin price from ticker API");
        }
    }

    private void updateBitcoinPriceCache(String currencyTicker, Double price) {
        log.debug("Update bitcoin price for ticker {}", currencyTicker);
        lastBitcoinBuyPriceMap.putIfAbsent(currencyTicker, new AtomicBitcoinPrice());
        lastBitcoinBuyPriceMap.get(currencyTicker)
            .set(price);
        log.debug("Update last price udpate for ticker {}", currencyTicker);
        lastBitcoinPriceUpdateMap
            .put(currencyTicker, LocalDateTime.now());
    }


    Long satoshisForPrice(Double price, Double exchangeRate) {
        double btc = (price / exchangeRate);
        return Math.round(Math.ceil(btc * SATOSHIS_IN_BTC.doubleValue()));
    }

    private static class TickerResponseType extends ParameterizedTypeReference<Map<String, Map<String, Object>>> {
    }

    private static class InfoResponseType extends ParameterizedTypeReference<Map<String, Object>> {
    }
}
