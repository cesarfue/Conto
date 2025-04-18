import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.User;
import com.sun.tools.javac.util.List;
import com.example.backend.model.Association;

public interface UserRepository extends JpaRepository<User, Long> {
  List<User> findByAssociation(Association association);
}
