package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.models.Tarea;
import mx.rdb.bimmanager.repositories.ProyectoRepository;
import mx.rdb.bimmanager.repositories.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    // 1. OBTENER LAS TAREAS DE UN PROYECTO
    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<Tarea>> getTareasPorProyecto(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(tareaRepository.findByProyectoId(proyectoId));
    }

    // 2. CREAR UNA NUEVA TAREA
    @PostMapping("/proyecto/{proyectoId}")
    public ResponseEntity<?> crearTarea(@PathVariable Long proyectoId, @RequestBody Tarea nuevaTarea) {
        return proyectoRepository.findById(proyectoId).map(proyecto -> {
            nuevaTarea.setProyecto(proyecto);
            // Por defecto, toda tarea nueva empieza en "Por hacer"
            if (nuevaTarea.getEstado() == null)
                nuevaTarea.setEstado("TODO");
            return ResponseEntity.ok(tareaRepository.save(nuevaTarea));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 3. ACTUALIZAR EL ESTADO (Para cuando arrastres la tarjeta en el frontend)
    @PatchMapping("/{tareaId}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long tareaId, @RequestBody Map<String, String> update) {
        return tareaRepository.findById(tareaId).map(tarea -> {
            tarea.setEstado(update.get("estado"));
            return ResponseEntity.ok(tareaRepository.save(tarea));
        }).orElse(ResponseEntity.notFound().build());
    }
}