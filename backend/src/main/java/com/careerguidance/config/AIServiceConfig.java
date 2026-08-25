package com.careerguidance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class AIServiceConfig {

    private final HuggingFaceProperties hfProperties;

    public AIServiceConfig(HuggingFaceProperties hfProperties) {
        this.hfProperties = hfProperties;
    }

    @Bean(name = "huggingFaceRestClient")
    public RestClient huggingFaceRestClient() {
        int connectTimeoutMs = hfProperties.getTimeout().getConnectSeconds() * 1000;
        int readTimeoutMs = hfProperties.getTimeout().getReadSeconds() * 1000;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(connectTimeoutMs > 0 ? connectTimeoutMs : 15000);
        requestFactory.setReadTimeout(readTimeoutMs > 0 ? readTimeoutMs : 180000);

        String baseUrl = hfProperties.getSpace().getUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://midhun-2542-career-guidance-system.hf.space";
        }

        RestClient.Builder builder = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .defaultHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .defaultHeader("Origin", baseUrl)
                .defaultHeader("Referer", baseUrl + "/");

        String token = hfProperties.getToken();
        if (token != null && !token.trim().isEmpty()) {
            builder.defaultHeader("Authorization", "Bearer " + token.trim());
        }

        return builder.build();
    }
}
