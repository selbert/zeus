package ch.puzzle.ln.zeus.web.rest;

import ch.puzzle.ln.zeus.domain.DynamicConfiguration;
import ch.puzzle.ln.zeus.security.AuthoritiesConstants;
import ch.puzzle.ln.zeus.service.DynamicConfigurationService;
import ch.puzzle.ln.zeus.service.ShopEvent;
import ch.puzzle.ln.zeus.service.ShopEventType;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminResource {

    private final DynamicConfigurationService dynamicConfigurationService;
    private final ApplicationEventPublisher eventPublisher;

    public AdminResource(DynamicConfigurationService dynamicConfigurationService,
                         ApplicationEventPublisher eventPublisher) {
        this.dynamicConfigurationService = dynamicConfigurationService;
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/config/{key}")
    @Secured(AuthoritiesConstants.ADMIN)
    public DynamicConfiguration getConfig(@PathVariable String key) {
        return dynamicConfigurationService.getByKey(key);
    }

    @PostMapping("/config/{key}")
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> updateConfig(@PathVariable String key, @RequestBody DynamicConfiguration config) {
        dynamicConfigurationService.setValue(key, config.getValue());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/shop/restart")
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> restart() {
        eventPublisher.publishEvent(new ShopEvent(this, ShopEventType.RESTART));
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
