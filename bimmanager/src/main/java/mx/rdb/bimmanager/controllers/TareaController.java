package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.HistorialTarea;
import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.models.Tarea;
import mx.rdb.bimmanager.repositories.HistorialTareaRepository;
import mx.rdb.bimmanager.repositories.ProyectoRepository;
import mx.rdb.bimmanager.repositories.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    // --- 1. INYECTAMOS EL REPOSITORIO DE AUDITORÍA ---
    @Autowired
    private HistorialTareaRepository historialTareaRepository;

    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<Tarea>> getTareasPorProyecto(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(tareaRepository.findByProyectoId(proyectoId));
    }

    @PostMapping("/proyecto/{proyectoId}")
    public ResponseEntity<?> crearTarea(@PathVariable Long proyectoId, @RequestBody Tarea nuevaTarea) {
        return proyectoRepository.findById(proyectoId).map(proyecto -> {
            nuevaTarea.setProyecto(proyecto);
            if (nuevaTarea.getEstado() == null)
                nuevaTarea.setEstado("TODO");
            return ResponseEntity.ok(tareaRepository.save(nuevaTarea));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 2. ACTUALIZAMOS ESTADO Y GUARDAMOS EL LOG ---
    @PatchMapping("/{tareaId}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long tareaId, @RequestBody Map<String, String> update) {
        return tareaRepository.findById(tareaId).map(tarea -> {

            String estadoAnterior = tarea.getEstado();
            String estadoNuevo = update.get("estado");

            // Si el estado realmente cambió, lo guardamos en la bitácora
            if (estadoAnterior != null && !estadoAnterior.equals(estadoNuevo)) {
                tarea.setEstado(estadoNuevo);
                Tarea tareaGuardada = tareaRepository.save(tarea);

                // Creamos el registro de la bóveda
                HistorialTarea log = new HistorialTarea(tareaGuardada, estadoAnterior, estadoNuevo);
                historialTareaRepository.save(log);

                return ResponseEntity.ok(tareaGuardada);
            }

            // Si no hubo cambios, solo regresamos la tarea
            return ResponseEntity.ok(tarea);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 3. EL ENDPOINT QUE FALTABA PARA VER EL HISTORIAL ---
    @GetMapping("/{tareaId}/historial")
    public ResponseEntity<List<HistorialTarea>> getHistorialTarea(@PathVariable Long tareaId) {
        return ResponseEntity.ok(historialTareaRepository.findByTareaIdOrderByFechaCambioDesc(tareaId));
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFotoDeTarea(@PathVariable Long id, @RequestParam("foto") MultipartFile file) {
        try {
            Optional<Tarea> tareaOptional = tareaRepository.findById(id);
            if (!tareaOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            Tarea tarea = tareaOptional.get();

            String nombreArchivo = "tarea_" + id + "_" + file.getOriginalFilename();
            Path rutaDirectorio = Paths.get("uploads");

            if (!Files.exists(rutaDirectorio)) {
                Files.createDirectories(rutaDirectorio);
            }

            Path rutaArchivo = rutaDirectorio.resolve(nombreArchivo);
            Files.copy(file.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

            tarea.setFotoUrl(nombreArchivo);
            tareaRepository.save(tarea);

            return ResponseEntity.ok(tarea);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir foto: " + e.getMessage());
        }
    }
}