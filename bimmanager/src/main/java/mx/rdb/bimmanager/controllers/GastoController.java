package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Gasto;
import mx.rdb.bimmanager.repositories.GastoRepository;
import mx.rdb.bimmanager.repositories.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoController {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<Gasto>> getGastosPorProyecto(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(gastoRepository.findByProyectoId(proyectoId));
    }

    @PostMapping("/proyecto/{proyectoId}")
    public ResponseEntity<?> registrarGasto(@PathVariable Long proyectoId, @RequestBody Gasto nuevoGasto) {
        return proyectoRepository.findById(proyectoId).map(proyecto -> {
            nuevoGasto.setProyecto(proyecto);
            if (nuevoGasto.getFecha() == null)
                nuevoGasto.setFecha(LocalDate.now());
            return ResponseEntity.ok(gastoRepository.save(nuevoGasto));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarGasto(@PathVariable Long id) {
        return gastoRepository.findById(id).map(gasto -> {
            gastoRepository.delete(gasto);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}