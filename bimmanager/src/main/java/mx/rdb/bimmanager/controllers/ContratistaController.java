package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Contratista;
import mx.rdb.bimmanager.repositories.ContratistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contratistas")
@CrossOrigin(origins = "*")
public class ContratistaController {

    @Autowired
    private ContratistaRepository contratistaRepository;

    // 1. OBTENER TODOS
    @GetMapping
    public List<Contratista> obtenerTodos() {
        return contratistaRepository.findAll();
    }

    // 2. CREAR NUEVO
    @PostMapping
    public Contratista crearContratista(@RequestBody Contratista contratista) {
        return contratistaRepository.save(contratista);
    }

    // 3. ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarContratista(@PathVariable Long id) {
        return contratistaRepository.findById(id).map(contratista -> {
            contratistaRepository.delete(contratista);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}