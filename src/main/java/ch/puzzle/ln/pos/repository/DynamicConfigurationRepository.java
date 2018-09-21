package ch.puzzle.ln.pos.repository;

import ch.puzzle.ln.pos.domain.DynamicConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DynamicConfigurationRepository extends JpaRepository<DynamicConfiguration, String> {
}
