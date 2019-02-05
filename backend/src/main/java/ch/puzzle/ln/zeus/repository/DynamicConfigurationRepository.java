package ch.puzzle.ln.zeus.repository;

import ch.puzzle.ln.zeus.domain.DynamicConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DynamicConfigurationRepository extends JpaRepository<DynamicConfiguration, String> {
}
