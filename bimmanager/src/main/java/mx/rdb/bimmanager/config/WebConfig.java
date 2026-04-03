package mx.rdb.bimmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convierte la carpeta física en una ruta web
        registry.addResourceHandler("/api/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}