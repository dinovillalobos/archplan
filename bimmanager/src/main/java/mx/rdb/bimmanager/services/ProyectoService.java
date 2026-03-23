package mx.rdb.bimmanager.services;

import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.repositories.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;

    // Obtener todos los proyectos
    public List<Proyecto> obtenerTodos() {
        return proyectoRepository.findAll();
    }

    // Guardar un nuevo proyecto
    public Proyecto crearProyecto(Proyecto proyecto) {
        // Aquí podríamos agregar validaciones en el futuro
        proyecto.setEstado("PLANIFICACION"); // Estado por defecto
        return proyectoRepository.save(proyecto);
    }

    // Buscar un proyecto por su ID
    public Optional<Proyecto> obtenerPorId(Long id) {
        return proyectoRepository.findById(id);
    }
}