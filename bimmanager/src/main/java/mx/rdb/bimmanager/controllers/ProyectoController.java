package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.services.ProyectoService;
import mx.rdb.bimmanager.repositories.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    // 2. SOLUCIÓN: Agregamos el repositorio que nos faltaba para el método PATCH
    @Autowired
    private ProyectoRepository proyectoRepository;

    @GetMapping
    public List<Proyecto> listarProyectos() {
        return proyectoService.obtenerTodos();
    }

    @PostMapping
    public Proyecto crearProyecto(@RequestBody Proyecto proyecto) {
        return proyectoService.crearProyecto(proyecto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> obtenerProyecto(@PathVariable Long id) {
        return proyectoService.obtenerPorId(id)
                .map(proyecto -> ResponseEntity.ok().body(proyecto))
                .orElse(ResponseEntity.notFound().build());
    }

    // El nuevo endpoint para editar el dinero
    @PatchMapping("/{id}/presupuesto")
    public ResponseEntity<?> actualizarPresupuesto(@PathVariable Long id, @RequestBody Map<String, BigDecimal> update) {
        return proyectoRepository.findById(id).map(proyecto -> {
            proyecto.setPresupuestoTotal(update.get("presupuestoTotal"));
            return ResponseEntity.ok(proyectoRepository.save(proyecto));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Permite actualizar solo el estado del proyecto (Planning, Construction,
    // Completed)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> update) {
        return proyectoRepository.findById(id).map(proyecto -> {
            proyecto.setEstado(update.get("estado"));
            return ResponseEntity.ok(proyectoRepository.save(proyecto));
        }).orElse(ResponseEntity.notFound().build());
    }
}