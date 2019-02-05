package ch.puzzle.ln.zeus.web.rest;

import ch.puzzle.ln.zeus.config.ApplicationProperties;
import ch.puzzle.ln.zeus.config.ApplicationProperties.Shop;
import ch.puzzle.ln.zeus.service.ShopService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop")
public class ShopResource {

    private final ApplicationProperties applicationProperties;
    private final ShopService shopService;

    public ShopResource(ApplicationProperties applicationProperties, ShopService shopService) {
        this.applicationProperties = applicationProperties;
        this.shopService = shopService;
    }

    @GetMapping("/available")
    public HttpEntity<Object> shopAvailable() {
        if (shopService.isClosed()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new HttpEntity<>(shopService.getDelayMinutes());
    }

    @GetMapping("/configuration")
    public HttpEntity<Shop> getConfiguration() {
        return new HttpEntity<>(applicationProperties.getShop());
    }
}
