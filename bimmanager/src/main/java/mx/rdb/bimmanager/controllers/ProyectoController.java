package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.services.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    // GET: http://localhost:8080/api/proyectos
    @GetMapping
    public List<Proyecto> listarProyectos() {
        return proyectoService.obtenerTodos();
    }

    // POST: http://localhost:8080/api/proyectos
    @PostMapping
    public Proyecto crearProyecto(@RequestBody Proyecto proyecto) {
        return proyectoService.crearProyecto(proyecto);
    }

    // GET: http://localhost:8080/api/proyectos/1
    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> obtenerProyecto(@PathVariable Long id) {
        return proyectoService.obtenerPorId(id)
                .map(proyecto -> ResponseEntity.ok().body(proyecto))
                .orElse(ResponseEntity.notFound().build());
    }
}