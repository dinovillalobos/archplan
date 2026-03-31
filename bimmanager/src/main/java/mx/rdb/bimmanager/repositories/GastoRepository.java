package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {
    List<Gasto> findByProyectoId(Long proyectoId);
}