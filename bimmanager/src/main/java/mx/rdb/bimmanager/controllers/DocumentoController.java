package mx.rdb.bimmanager.controllers;

import mx.rdb.bimmanager.models.Documento;
import mx.rdb.bimmanager.services.DocumentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = "*")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;
    @Autowired
    private mx.rdb.bimmanager.repositories.DocumentoRepository documentoRepository;

    // 1. Obtener la lista de documentos de un proyecto
    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<Documento>> listarPorProyecto(@PathVariable Long proyectoId) {
        List<Documento> documentos = documentoRepository.findByProyectoId(proyectoId);
        return new ResponseEntity<>(documentos, HttpStatus.OK);
    }

    // 2. Ver o descargar el archivo físico directamente en el navegador
    @GetMapping("/ver/{nombreArchivo:.+}")
    public ResponseEntity<Resource> verArchivo(@PathVariable String nombreArchivo) {
        try {
            Path rutaArchivo = Paths.get("uploads").resolve(nombreArchivo).normalize();
            Resource recurso = new UrlResource(rutaArchivo.toUri());
            String contentType = "application/octet-stream";
            if (recurso.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + recurso.getFilename() + "\"")
                        .body(recurso);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/subir")
    public ResponseEntity<?> subirDocumento(
            @RequestParam("proyectoId") Long proyectoId,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            Documento doc = documentoService.guardarArchivo(proyectoId, archivo);
            return new ResponseEntity<>(doc, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al subir el archivo: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}