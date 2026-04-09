package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.HistorialTarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialTareaRepository extends JpaRepository<HistorialTarea, Long> {
    // Queremos la historia de una tarea específica, ordenada de lo más reciente a
    // lo más viejo
    List<HistorialTarea> findByTareaIdOrderByFechaCambioDesc(Long tareaId);
}