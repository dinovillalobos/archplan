package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // SELECT * FROM tareas WHERE proyecto_id = ?
    List<Tarea> findByProyectoId(Long proyectoId);
}