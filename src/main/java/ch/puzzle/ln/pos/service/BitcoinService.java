package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.config.ApplicationProperties;
import ch.puzzle.ln.pos.config.ApplicationProperties.Bitcoin;
import ch.puzzle.ln.pos.web.rest.errors.InternalServerErrorException;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URISyntaxException;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Service
public class BitcoinService {

    private static final Long SATOSHIS_IN_BTC = 100000000L;
    private static final String FIELD_BUY = "buy";

    private final Bitcoin bitcoinProperties;
    private final RestTemplate tickerTemplate;

    public BitcoinService(ApplicationProperties applicationProperties) {
        this.bitcoinProperties = applicationProperties.getBitcoin();
        tickerTemplate = new RestTemplateBuilder()
            .setConnectTimeout(bitcoinProperties.getConnectTimeout())
            .setReadTimeout(bitcoinProperties.getReadTimeout())
            .rootUri(bitcoinProperties.getTickerUrl())
            .build();
    }

    public Map<String, Object> pricePerBitcoinIn(String ticker) {
        try {
            RequestEntity<Void> request = RequestEntity.get(bitcoinProperties.getTickerUri()).accept(APPLICATION_JSON).build();
            ResponseEntity<Map<String, Map<String, Object>>> parsed = tickerTemplate.exchange(request, new TickerResponseType());
            if (parsed.getStatusCode().is2xxSuccessful() && parsed.getBody() != null) {
                return parsed.getBody().get(ticker);
            }
        } catch (URISyntaxException e) {
            throw new InternalServerErrorException("could not call ticker URI");
        }

        return null;
    }

    public Map<String, Object> chainInfo() throws Exception {
        RestTemplate tpl = new RestTemplate();
        RequestEntity<Void> request = RequestEntity.get(bitcoinProperties.getRestUri()).accept(APPLICATION_JSON).build();
        ResponseEntity<Map<String, Object>> parsed = tpl.exchange(request, new InfoResponseType());
        if (parsed.getStatusCode().is2xxSuccessful() && parsed.getBody() != null) {
            return parsed.getBody();
        }
        return null;
    }

    public Double buyPricePerBitcoinIn(String ticker) {
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

    public Long satoshisForPrice(Double price, Double exchangeRate) {
        double btc = (price / exchangeRate);
        return Math.round(Math.ceil(btc * SATOSHIS_IN_BTC.doubleValue()));
    }

    private static class TickerResponseType extends ParameterizedTypeReference<Map<String, Map<String, Object>>> {
    }

    private static class InfoResponseType extends ParameterizedTypeReference<Map<String, Object>> {
    }
}
