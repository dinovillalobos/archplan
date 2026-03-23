package mx.rdb.bimmanager.services;

import mx.rdb.bimmanager.models.Documento;
import mx.rdb.bimmanager.models.Proyecto;
import mx.rdb.bimmanager.repositories.DocumentoRepository;
import mx.rdb.bimmanager.repositories.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    @Autowired
    private ProyectoRepository proyectoRepository;

    // Carpeta donde se guardarán los planos físicamente en tu PC
    private final String UPLOAD_DIR = "uploads/";

    public Documento guardarArchivo(Long proyectoId, MultipartFile archivo) throws IOException {
        Optional<Proyecto> proyectoOpt = proyectoRepository.findById(proyectoId);

        if (proyectoOpt.isPresent()) {
            Proyecto proyecto = proyectoOpt.get();

            // 1. Crear la carpeta "uploads" si no existe
            File directorio = new File(UPLOAD_DIR);
            if (!directorio.exists()) {
                directorio.mkdirs();
            }

            // 2. Guardar el archivo físicamente
            byte[] bytes = archivo.getBytes();
            Path rutaFisica = Paths.get(UPLOAD_DIR + archivo.getOriginalFilename());
            Files.write(rutaFisica, bytes);

            // 3. Guardar el registro en la Base de Datos
            Documento doc = new Documento();
            doc.setNombre(archivo.getOriginalFilename());
            doc.setTipoArchivo(archivo.getContentType());
            doc.setRutaArchivo(rutaFisica.toString());
            doc.setProyecto(proyecto); // ¡Aquí hacemos la relación!

            return documentoRepository.save(doc);
        } else {
            throw new RuntimeException("Error: El proyecto con ID " + proyectoId + " no existe.");
        }
    }
}