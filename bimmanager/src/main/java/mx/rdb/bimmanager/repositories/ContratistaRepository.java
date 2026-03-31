package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.Contratista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContratistaRepository extends JpaRepository<Contratista, Long> {
    // Spring Data JPA hace toda la magia aquí
}