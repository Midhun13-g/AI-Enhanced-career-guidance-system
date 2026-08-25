package com.careerguidance.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "huggingface")
public class HuggingFaceProperties {

    private Space space = new Space();
    private String token;
    private Timeout timeout = new Timeout();
    private Retry retry = new Retry();

    public static class Space {
        private String id;
        private String url = "https://midhun-2542-career-guidance-system.hf.space";
        private String analyzeEndpoint = "/api/resume/analyze";

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getUrl() {
            if (url != null && url.contains("huggingface.co/spaces/")) {
                String path = url.replaceFirst("^https?://huggingface\\.co/spaces/", "").replaceAll("/+$", "");
                String[] parts = path.split("/", 2);
                if (parts.length == 2) {
                    String username = parts[0].replace("_", "-");
                    String spaceName = parts[1].replace("_", "-");
                    return "https://" + username + "-" + spaceName + ".hf.space";
                }
            }
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getAnalyzeEndpoint() {
            return analyzeEndpoint;
        }

        public void setAnalyzeEndpoint(String analyzeEndpoint) {
            this.analyzeEndpoint = analyzeEndpoint;
        }
    }

    public static class Timeout {
        private int connectSeconds = 15;
        private int readSeconds = 180;

        public int getConnectSeconds() {
            return connectSeconds;
        }

        public void setConnectSeconds(int connectSeconds) {
            this.connectSeconds = connectSeconds;
        }

        public int getReadSeconds() {
            return readSeconds;
        }

        public void setReadSeconds(int readSeconds) {
            this.readSeconds = readSeconds;
        }
    }

    public static class Retry {
        private int maxAttempts = 3;
        private long backoffMs = 2000;

        public int getMaxAttempts() {
            return maxAttempts;
        }

        public void setMaxAttempts(int maxAttempts) {
            this.maxAttempts = maxAttempts;
        }

        public long getBackoffMs() {
            return backoffMs;
        }

        public void setBackoffMs(long backoffMs) {
            this.backoffMs = backoffMs;
        }
    }

    public Space getSpace() {
        return space;
    }

    public void setSpace(Space space) {
        this.space = space;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Timeout getTimeout() {
        return timeout;
    }

    public void setTimeout(Timeout timeout) {
        this.timeout = timeout;
    }

    public Retry getRetry() {
        return retry;
    }

    public void setRetry(Retry retry) {
        this.retry = retry;
    }
}
