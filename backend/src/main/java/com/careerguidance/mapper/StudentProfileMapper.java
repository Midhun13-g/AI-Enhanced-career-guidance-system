package com.careerguidance.mapper;

import com.careerguidance.dto.request.StudentProfileRequest;
import com.careerguidance.dto.response.StudentProfileResponse;
import com.careerguidance.entity.StudentProfile;
import com.careerguidance.entity.User;

public class StudentProfileMapper {

    private StudentProfileMapper() {
    }

    public static StudentProfile toEntity(StudentProfileRequest request, User user) {
        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setCountry(request.getCountry());
        profile.setCollegeName(request.getCollegeName());
        profile.setDepartment(request.getDepartment());
        profile.setDegree(request.getDegree());
        profile.setYearOfStudy(request.getYearOfStudy());
        profile.setCgpa(request.getCgpa());
        profile.setSkills(request.getSkills());
        profile.setInterests(request.getInterests());
        profile.setCareerGoal(request.getCareerGoal());
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setBio(request.getBio());
        return profile;
    }

    public static void updateEntity(StudentProfile profile, StudentProfileRequest request) {
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setCountry(request.getCountry());
        profile.setCollegeName(request.getCollegeName());
        profile.setDepartment(request.getDepartment());
        profile.setDegree(request.getDegree());
        profile.setYearOfStudy(request.getYearOfStudy());
        profile.setCgpa(request.getCgpa());
        profile.setSkills(request.getSkills());
        profile.setInterests(request.getInterests());
        profile.setCareerGoal(request.getCareerGoal());
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setBio(request.getBio());
    }

    public static StudentProfileResponse toResponse(StudentProfile profile) {
        StudentProfileResponse response = new StudentProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setProfileImage(profile.getProfileImage());
        response.setFirstName(profile.getFirstName());
        response.setLastName(profile.getLastName());
        response.setEmail(profile.getEmail());
        response.setPhone(profile.getPhone());
        response.setGender(profile.getGender());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setAddress(profile.getAddress());
        response.setCity(profile.getCity());
        response.setState(profile.getState());
        response.setCountry(profile.getCountry());
        response.setCollegeName(profile.getCollegeName());
        response.setDepartment(profile.getDepartment());
        response.setDegree(profile.getDegree());
        response.setYearOfStudy(profile.getYearOfStudy());
        response.setCgpa(profile.getCgpa());
        response.setSkills(profile.getSkills());
        response.setInterests(profile.getInterests());
        response.setCareerGoal(profile.getCareerGoal());
        response.setPreferredLocation(profile.getPreferredLocation());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setGithubUrl(profile.getGithubUrl());
        response.setPortfolioUrl(profile.getPortfolioUrl());
        response.setBio(profile.getBio());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
