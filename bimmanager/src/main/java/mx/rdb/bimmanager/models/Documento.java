package mx.rdb.bimmanager.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre; // Ej: "Plano_Estructural_V1"

    @Column(name = "tipo_archivo", nullable = false)
    private String tipoArchivo; // Ej: "PDF", "DWG", "RVT"

    @Column(name = "ruta_archivo", nullable = false)
    private String rutaArchivo; // Dónde se guardará físicamente el archivo

    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida;

    // --- LA RELACIÓN CON PROYECTO ---
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proyecto_id", nullable = false)
    @JsonIgnore // Esto evita un ciclo infinito al imprimir el JSON en Postman
    private Proyecto proyecto;

    @PrePersist
    protected void onCreate() {
        this.fechaSubida = LocalDateTime.now();
    }
}