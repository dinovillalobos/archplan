package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    // ¡Spring hace la magia solo con nombrar bien el método!
    List<Documento> findByProyectoId(Long proyectoId);
}