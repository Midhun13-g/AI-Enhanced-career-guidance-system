package com.careerguidance.dto.request;
import jakarta.validation.constraints.*;
public class UpdateStudentRequest {
 @NotBlank private String firstName; @NotBlank private String lastName; @Email @NotBlank private String email; private String phone; @DecimalMin("0.0") @DecimalMax("10.0") private Double cgpa; private String collegeName;
 public String getFirstName(){return firstName;} public void setFirstName(String v){firstName=v;} public String getLastName(){return lastName;} public void setLastName(String v){lastName=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPhone(){return phone;} public void setPhone(String v){phone=v;} public Double getCgpa(){return cgpa;} public void setCgpa(Double v){cgpa=v;} public String getCollegeName(){return collegeName;} public void setCollegeName(String v){collegeName=v;}
}
