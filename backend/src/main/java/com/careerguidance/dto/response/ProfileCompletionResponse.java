package com.careerguidance.dto.response;

import java.util.ArrayList;
import java.util.List;

public class ProfileCompletionResponse {
    private int profileCompletion;
    private List<String> missingFields = new ArrayList<>();

    public ProfileCompletionResponse() {
    }

    public ProfileCompletionResponse(int profileCompletion, List<String> missingFields) {
        this.profileCompletion = profileCompletion;
        this.missingFields = missingFields == null ? new ArrayList<>() : missingFields;
    }

    public int getProfileCompletion() {
        return profileCompletion;
    }

    public void setProfileCompletion(int profileCompletion) {
        this.profileCompletion = profileCompletion;
    }

    public List<String> getMissingFields() {
        return missingFields;
    }

    public void setMissingFields(List<String> missingFields) {
        this.missingFields = missingFields == null ? new ArrayList<>() : missingFields;
    }
}
