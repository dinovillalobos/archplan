package mx.rdb.bimmanager.repositories;

import mx.rdb.bimmanager.models.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Aquí puedes agregar métodos personalizados después, por ejemplo:
    List<Proyecto> findByEstado(String estado);
}