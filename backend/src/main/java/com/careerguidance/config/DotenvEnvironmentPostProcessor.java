package com.careerguidance.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory(resolveEnvDirectory())
                    .ignoreIfMissing()
                    .load();
            Map<String, String> rawEntries = new HashMap<>();
            dotenv.entries().forEach(entry -> rawEntries.put(entry.getKey(), entry.getValue()));
            environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", buildProperties(rawEntries)));
        } catch (DotenvException ignored) {
        }
    }

    private String resolveEnvDirectory() {
        // Walk up from cwd until we find a .env file or hit the filesystem root
        java.io.File dir = new java.io.File(System.getProperty("user.dir"));
        while (dir != null) {
            if (new java.io.File(dir, ".env").exists()) return dir.getAbsolutePath();
            dir = dir.getParentFile();
        }
        return System.getProperty("user.dir");
    }

    Map<String, Object> buildProperties(Map<String, String> entries) {
        Map<String, Object> props = new HashMap<>();
        entries.forEach(props::put);

        String host = entries.getOrDefault("DB_HOST", "localhost");
        String port = entries.getOrDefault("DB_PORT", "5432");
        String name = entries.getOrDefault("DB_NAME", "careerguidance");
        String sslMode = entries.getOrDefault("DB_SSLMODE", "prefer");
        String user = entries.getOrDefault("DB_USER", "postgres");
        String password = entries.getOrDefault("DB_PASSWORD", "postgres");

        String datasourceUrl = entries.getOrDefault(
                "SPRING_DATASOURCE_URL",
                String.format("jdbc:postgresql://%s:%s/%s?sslmode=%s", host, port, name, sslMode)
        );

        props.put("SPRING_DATASOURCE_URL", datasourceUrl);
        props.put("SPRING_DATASOURCE_USERNAME", entries.getOrDefault("SPRING_DATASOURCE_USERNAME", user));
        props.put("SPRING_DATASOURCE_PASSWORD", entries.getOrDefault("SPRING_DATASOURCE_PASSWORD", password));
        return props;
    }
}
