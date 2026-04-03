package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.models.Tarea;
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

    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFotoDeTarea(@PathVariable Long id, @RequestParam("foto") MultipartFile file) {
        try {
            // 1. Buscamos la tarea en la base de datos
            Optional<Tarea> tareaOptional = tareaRepository.findById(id);
            if (!tareaOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            Tarea tarea = tareaOptional.get();

            // 2. Guardamos el archivo físicamente en la carpeta "uploads"
            String nombreArchivo = "tarea_" + id + "_" + file.getOriginalFilename();
            Path rutaDirectorio = Paths.get("uploads");

            if (!Files.exists(rutaDirectorio)) {
                Files.createDirectories(rutaDirectorio);
            }

            Path rutaArchivo = rutaDirectorio.resolve(nombreArchivo);
            Files.copy(file.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

            // 3. Guardamos el nombre del archivo en la base de datos
            tarea.setFotoUrl(nombreArchivo);
            tareaRepository.save(tarea);

            return ResponseEntity.ok(tarea);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir foto: " + e.getMessage());
        }
    }
}