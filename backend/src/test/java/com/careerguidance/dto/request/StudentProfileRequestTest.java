package com.careerguidance.dto.request;

import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

class StudentProfileRequestTest {

    @Test
    void shouldDeserializeBlankDateOfBirthAsNull() throws Exception {
        ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
        String json = "{\"firstName\":\"Jane\",\"lastName\":\"Doe\",\"email\":\"jane@example.com\",\"dateOfBirth\":\"\"}";

        StudentProfileRequest request = mapper.readValue(json, StudentProfileRequest.class);

        assertNull(request.getDateOfBirth());
    }
}
