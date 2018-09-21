package ch.puzzle.ln.pos.service;

import ch.puzzle.ln.pos.domain.DynamicConfiguration;
import ch.puzzle.ln.pos.repository.DynamicConfigurationRepository;
import org.springframework.stereotype.Service;

@Service
public class DynamicConfigurationService {

    public static final String KEY_SHOP_ACTIVE = "shop.active";

    private final DynamicConfigurationRepository repository;

    public DynamicConfigurationService(DynamicConfigurationRepository repository) {
        this.repository = repository;
    }

    public DynamicConfiguration getByKey(String key) {
        return repository.findById(key).orElse(null);
    }

    public void setValue(String key, String value) {
        DynamicConfiguration config = repository.findById(key).orElse(new DynamicConfiguration(key, value));
        config.setValue(value);
        repository.saveAndFlush(config);
    }
}
