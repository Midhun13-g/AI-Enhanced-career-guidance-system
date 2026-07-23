package com.careerguidance.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        File envFile = findEnvFile();
        if (envFile == null) return;

        Map<String, Object> props = new HashMap<>();
        try {
            for (String line : Files.readAllLines(envFile.toPath())) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                int idx = line.indexOf('=');
                if (idx < 1) continue;
                String key = line.substring(0, idx).trim();
                String value = line.substring(idx + 1).trim();
                props.put(key, value);
            }
        } catch (IOException ignored) {
            return;
        }

        environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", props));
    }

    private File findEnvFile() {
        File dir = new File(System.getProperty("user.dir"));
        for (int i = 0; i < 3; i++) {
            File f = new File(dir, ".env");
            if (f.exists()) return f;
            File backendEnv = new File(dir, "backend/.env");
            if (backendEnv.exists()) return backendEnv;
            dir = dir.getParentFile();
            if (dir == null) break;
        }
        return null;
    }
}
