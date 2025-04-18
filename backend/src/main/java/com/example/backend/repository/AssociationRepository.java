import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Association;

public interface AssociationRepository extends JpaRepository<Association, Long> {
  Optional<Association> findByEmail(String email);
}
