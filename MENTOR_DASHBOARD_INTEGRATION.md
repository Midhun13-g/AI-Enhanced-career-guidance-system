# Mentor Dashboard Integration Guide

## Overview

The Mentor Dashboard has been updated to display real data from the backend API and properly connect with required models and data sources.

## Changes Made

### 1. Frontend - MentorPages.jsx

**File:** `/frontend/src/pages/mentor/MentorPages.jsx`

#### Key Updates

- **Real Data Fetching**: MentorDashboard now fetches data from two backend endpoints:
  - `mentorService.getDashboard()` - Gets dashboard statistics
  - `mentorService.getStudents()` - Gets assigned students list

- **Dynamic Data Visualization**:
  - **Assessment Distribution Chart**: Generates bar chart from assigned students' data
  - **Career Interests Chart**: Pie chart showing career goal distribution
  - **Student Cards**: Displays real student information with proper fallbacks

- **Fixed Field Mappings**:
  - `pendingReviews` → `pendingResumeReviews` (backend field)
  - `averageStudentScore` → `averageResumeScore` + `averageAssessmentScore` (both displayed)
  - `goal` → `careerGoal` (correct student profile field)

- **Improved Error Handling**:
  - Try-catch blocks for API calls
  - Loading states during data fetch
  - Fallback UI when no data available
  - Proper cleanup in useEffect hooks

#### Components

- **MentorDashboard**: Main dashboard with stats, charts, and student assignments
- **StudentsPage**: Searchable list of assigned students
- **AssessmentPage**: Assessment review interface with scores and insights
- **ResumePage**: Resume review interface with ATS/Resume scores
- **FeedbackForm**: Reusable form for submitting mentor feedback
- **StudentCard**: Individual student display card with profile info
- **Stat**: Dashboard stat widget
- **Insight**: Information display box for strengths/opportunities

### 2. Backend - DTOs (Data Transfer Objects)

**File:** `/backend/src/main/java/com/careerguidance/dto/response/AssignedStudentResponse.java`

#### Changes

```java
// BEFORE:
public record AssignedStudentResponse(Long id, String firstName, String lastName, 
    String email, String collegeName, Double cgpa, Integer profileCompletion) {}

// AFTER:
public record AssignedStudentResponse(Long id, String firstName, String lastName, 
    String email, String collegeName, Double cgpa, Integer profileCompletion, String careerGoal) {}
```

**Why**: Frontend needs careerGoal to display student career objectives in dashboard cards.

### 3. Backend - Service Layer

**File:** `/backend/src/main/java/com/careerguidance/service/MentorReviewService.java`

#### Changes

Updated `student()` method to include careerGoal from StudentProfile:

```java
private AssignedStudentResponse student(User u) {
    StudentProfile p = profiles.findByUserId(u.getId()).orElse(null);
    return new AssignedStudentResponse(
        u.getId(),
        u.getFirstName(),
        u.getLastName(),
        u.getEmail(),
        p == null ? u.getCollegeName() : p.getCollegeName(),
        p == null ? u.getCgpa() : p.getCgpa(),
        completion(p),
        p == null ? null : p.getCareerGoal()  // NEW FIELD
    );
}
```

## API Endpoints Connected

### Dashboard Endpoint

**GET** `/api/mentor/dashboard`

- **Authentication**: Requires MENTOR role
- **Response Model**: `MentorDashboardResponse`
- **Fields Returned**:
  - `assignedStudents: long` - Total number of assigned students
  - `pendingResumeReviews: long` - Resumes awaiting review
  - `completedReviews: long` - Completed reviews
  - `averageResumeScore: Double` - Average resume score (0-100)
  - `averageAssessmentScore: Double` - Average assessment score (0-100)

### Students Endpoint

**GET** `/api/mentor/students`

- **Authentication**: Requires MENTOR role
- **Query Parameters**:
  - `page` (default: 0) - Page number
  - `size` (default: 20) - Items per page
  - `sort` (default: id) - Sort field
- **Response Model**: `Page<AssignedStudentResponse>`
- **Fields Per Student**:
  - `id: Long` - Student user ID
  - `firstName: String` - First name
  - `lastName: String` - Last name
  - `email: String` - Email address
  - `collegeName: String` - College/University name
  - `cgpa: Double` - Current GPA
  - `profileCompletion: Integer` - Profile completion percentage (0-100)
  - `careerGoal: String` - Career goal/objective (NEW)

## Data Models and Integration

### Mentor Model

- **Entity**: `Mentor` (JPA entity)
- **Fields**: Id, user, company, jobTitle, expertise, bio, verification status
- **Related Tables**: Linked to User entity via mentor assignment

### StudentProfile Model

- **Entity**: `StudentProfile` (JPA entity)
- **Key Fields for Dashboard**:
  - `collegeName`: Student's college/university
  - `cgpa`: Current GPA
  - `careerGoal`: Career objective/target role
  - `skills`: List of skills
  - `interests`: Career interests
  - Profile completion logic counts: collegeName, degree, cgpa, skills, interests, careerGoal

### MentorStudent Assignment

- **Entity**: `MentorStudent` (linking table)
- **Purpose**: Manages mentor-student relationships
- **Key Query**: `findByMentorId()` - Gets all students assigned to a mentor

## Real Data Flow

1. **User Login** → Mentor role assigned
2. **Navigate to Mentor Dashboard** → MentorDashboard component mounts
3. **useEffect Hook Fires** → Fetches data from backend
   - Calls `/api/mentor/dashboard` → Gets statistics
   - Calls `/api/mentor/students` → Gets student list (paginated)
4. **Data Received** → State updated with real data
5. **Components Render** with:
   - Real student counts and review metrics
   - Chart data derived from students' career goals
   - Student cards showing actual profile information
   - Proper careerGoal display from StudentProfile

## Key Features Implemented

### ✅ Real Data Binding

- Dashboard statistics pull from actual database queries
- Student lists are paginated from MentorStudent assignments
- Career interests aggregated from StudentProfile.careerGoal

### ✅ Dynamic Charts

- Assessment distribution generated from student data
- Career interest pie chart built from careerGoal distribution
- Charts update when student data changes

### ✅ Search Functionality

- Students page supports real-time search across all student fields
- Search filters across: name, email, college, CGPA, career goal

### ✅ Error Handling

- API call failures show appropriate error messages
- Missing fields fallback to "—" or "Not set"
- Network errors logged to console
- Loading state prevents UI issues during data fetch

### ✅ Student Profile Information

- Each student card displays:
  - Name (constructed from firstName + lastName)
  - College name
  - Career goal (NEW)
  - CGPA
  - Profile completion percentage
  - Review action button

## Testing the Integration

### 1. Backend Tests

```bash
cd backend
mvn clean compile
mvn test
```

### 2. Frontend Build

```bash
cd frontend
npm install
npm run build
```

### 3. Local Development

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend  
cd frontend
npm run dev

# Access at http://localhost:5174/mentor
```

### 4. Verify Data Flow

1. Login as a mentor user (if not available, create one via admin panel)
2. Navigate to `/mentor` dashboard
3. Verify:
   - ✓ Dashboard stats show real numbers (not hardcoded values)
   - ✓ Student cards display actual student information
   - ✓ Career goals are populated
   - ✓ Search functionality works
   - ✓ Charts update with real data

## Dependency Chain

```
MentorDashboard Component
  ├── Uses: mentorService.getDashboard()
  │   └── API: GET /api/mentor/dashboard
  │       └── Service: MentorReviewService.dashboard()
  │           ├── Queries: MentorStudentRepository.findByMentorId()
  │           ├── Queries: ResumeRepository for review status
  │           └── Queries: AssessmentResultRepository for scores
  │
  ├── Uses: mentorService.getStudents()
  │   └── API: GET /api/mentor/students
  │       └── Controller: StudentReviewController.list()
  │           └── Service: MentorReviewService.students()
  │               ├── Queries: MentorStudentRepository.findByMentorId()
  │               └── Maps: User → StudentProfile → AssignedStudentResponse
  │
  └── Displays:
      ├── Real Dashboard Stats
      ├── Career Interest Pie Chart
      ├── Assessment Distribution Bar Chart
      └── Student Cards (with real profiles)
```

## Files Modified

| File | Changes | Purpose |
| ------ | --------- | --------- |
| `frontend/src/pages/mentor/MentorPages.jsx` | Complete rewrite | Real data binding and charts |
| `backend/src/main/java/com/careerguidance/dto/response/AssignedStudentResponse.java` | Added careerGoal field | Include career goals in API response |
| `backend/src/main/java/com/careerguidance/service/MentorReviewService.java` | Updated student() method | Populate careerGoal in responses |

## Existing Controllers & Routes

These existing endpoints are now properly utilized:

1. **MentorDashboardController.java** - Dashboard statistics
2. **StudentReviewController.java** - Student list (/api/mentor/students)
3. **ResumeReviewController.java** - Resume reviews
4. **AssessmentReviewController.java** - Assessment reviews
5. **MentorAuthController.java** - Authentication

## Next Steps (Optional Enhancements)

- [ ] Add real-time update functionality (WebSocket)
- [ ] Implement resume PDF preview in ResumePage
- [ ] Add student-specific assessment details
- [ ] Implement mentor feedback history
- [ ] Add export functionality for reports
- [ ] Create mentor analytics dashboard
- [ ] Implement notification system for new reviews

## Troubleshooting

### Issue: Dashboard shows no students

**Solution**:

- Check if mentor has assigned students in database
- Run: `SELECT * FROM mentor_student WHERE mentor_id = ?`
- If empty, assign students via admin panel

### Issue: CareerGoal shows as "Not set"

**Solution**:

- Check StudentProfile.careerGoal in database
- Ensure students have filled out their career goals in profile
- Field can be null in database, UI handles with fallback

### Issue: API returns 403 Forbidden

**Solution**:

- Verify logged-in user has MENTOR role
- Check JWT token includes ROLE_MENTOR
- Verify MentorDashboardController @PreAuthorize annotation

### Issue: Charts don't display

**Solution**:

- Check browser console for errors
- Verify Recharts library is installed: `npm list recharts`
- Check data format matches chart requirements

## Conclusion

The Mentor Dashboard is now fully integrated with real backend data and models. All components display actual student information, assessments, and review metrics from the database. The system properly handles edge cases and provides a seamless user experience.
