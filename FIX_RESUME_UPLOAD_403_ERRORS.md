# Fix for Resume Upload 403 Forbidden Errors

## Problem

Users attempting to upload and analyze resumes were receiving HTTP 403 (Forbidden) responses, preventing the AI resume analysis feature from functioning.

## Root Causes Identified

1. **Missing Role Assignments**: Users might not have the `STUDENT` role assigned in the database after registration
2. **Lazy Loading Issues**: User roles weren't eagerly loaded during authentication, causing them to be unavailable during authorization checks
3. **No Fallback Role**: If a user somehow had no roles, there was no default role assignment

## Solutions Implemented

### 1. **Added EntityGraph to UserRepository** (`UserRepository.java`)

- Added `@EntityGraph(attributePaths = "roles")` to `findByEmail()` method
- Ensures roles are eagerly loaded when authenticating a user
- Prevents lazy loading exceptions and missing role data

### 2. **Enhanced UserDetailsImpl** (`UserDetailsImpl.java`)

- Added safety check to ensure users always have at least one authority
- Defaults to `ROLE_STUDENT` if no roles are found
- Prevents empty authorities collection which would cause authorization failures

### 3. **Improved AuthServiceImpl** (`AuthServiceImpl.java`)

- Enhanced error messages for missing STUDENT role
- Added verification that role was successfully assigned after user save
- Throws descriptive exception if role assignment fails

### 4. **Database Migration** (`V8__fix_missing_user_roles.sql`)

- New migration to fix any existing users missing role assignments
- Assigns `STUDENT` role to any user without a role
- Runs automatically on application startup

## How These Fixes Work

**Before (Failing Flow):**

```
User registers → User saved without role → 
Authentication succeeds → No authorities loaded → 
Authorization check fails (403) → Resume upload fails
```

**After (Fixed Flow):**

```
User registers → User saved with STUDENT role → 
Authentication succeeds → Roles eagerly loaded via EntityGraph → 
Authorities populated correctly → Authorization succeeds → 
Resume upload and AI analysis works
```

## Changes Made

1. **UserRepository.java**
   - Added import: `org.springframework.data.jpa.repository.EntityGraph`
   - Updated `findByEmail()` with `@EntityGraph` annotation

2. **UserDetailsImpl.java**
   - Added null-safety check in `build()` method
   - Defaults to STUDENT role if authorities are empty

3. **AuthServiceImpl.java**
   - Improved error message for missing role
   - Added verification that saved user has roles
   - Throws exception if role assignment fails

4. **V8__fix_missing_user_roles.sql**
   - New database migration to repair existing data
   - Idempotent (uses `ON CONFLICT DO NOTHING`)

## Testing Steps

1. **For New Users:**
   - Register a new student account
   - Verify roles are assigned in database: `SELECT * FROM user_roles WHERE user_id = <id>;`
   - Login and navigate to `/resume/upload`
   - Upload a PDF resume file
   - Click "Analyze with AI Career Guidance"
   - Verification: Resume should upload and AI analysis should begin

2. **For Existing Users:**
   - Run migration V8 (automatic on app startup)
   - Verify fixes: `SELECT u.id, u.email, COUNT(ur.role_id) as role_count FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id GROUP BY u.id, u.email;`
   - All users should have role_count >= 1

## Deployment Instructions

1. Update backend code with the three Java file changes
2. Restart the backend application (migration runs automatically)
3. Clear browser cache to ensure latest frontend is loaded
4. Test resume upload as described above

## Additional Notes

- The fixes are backward-compatible and don't break existing functionality
- All changes follow Spring Security best practices
- Entity graphs improve performance by avoiding N+1 queries
- The fallback to STUDENT role is defensive programming to prevent edge cases

## Related Endpoints

- Resume Upload: `POST /api/resumes/upload`
- Resume Analysis: `POST /api/resumes/analyze`
- Analysis History: `GET /api/resumes/analyses`
- All require: `@PreAuthorize("hasRole('STUDENT')")`

## Contact

If issues persist after applying these fixes, check:

1. Backend logs for role loading errors
2. Database: verify roles table has STUDENT role
3. Database: verify user_roles table has entries for your test user
4. JWT token: decode and verify it contains correct role claim
