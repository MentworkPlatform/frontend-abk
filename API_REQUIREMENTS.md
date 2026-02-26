# API Requirements for Frontend Changes

This document outlines all backend/API modifications required to support the frontend changes made.

---

## 1. Free Trial Sessions Feature

### Database Schema Changes
**Program Model:**
```typescript
{
  freeSessionsIncluded: number // Number of free trial sessions (0 if none)
}
```

**CurriculumTopic Model:**
```typescript
{
  isFree: boolean // Mark session/topic as free trial
}
```

**Enrollment Model:**
```typescript
{
  enrollmentType: "free-trial" | "full-program"
  sessionsAccess: number // For free trial, limit to freeSessionsIncluded
}
```

### API Endpoints Needed
- `POST /api/programs/{id}/enroll/free-trial` - Enroll in free trial (no payment)
- `POST /api/programs/{id}/enroll/full` - Enroll in full program (with payment)
- `GET /api/programs/{id}` - Should return `freeSessionsIncluded` and `isFree` for each topic

---

## 2. Mentor Application/Interest

### Database Schema Changes
**MentorApplication Model:**
```typescript
{
  id: string
  programId: string
  mentorId: string
  mentorName: string
  mentorEmail: string
  expertise: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
}
```

### API Endpoints Needed
- `POST /api/programs/{id}/mentor/apply` - Submit mentor interest for a program
- `GET /api/mentor/applications` - Get mentor's applications
- `GET /api/trainer/programs/{id}/mentor-applications` - Get applications for trainer's program
- `PUT /api/trainer/programs/{id}/mentor-applications/{applicationId}` - Accept/reject mentor

---

## 3. Program Structure Updates

### Database Schema Changes
**Program Model - Added Fields:**
```typescript
{
  prerequisites: string[] // List of prerequisites for the program
  mentorCompensation: string // e.g., "₦225,000/session"
  sessions: number // Total number of sessions
}
```

### API Endpoints Needed
- `PUT /api/programs/{id}` - Update to accept `prerequisites`, `mentorCompensation`, `sessions`

---

## 4. Currency Handling

### Conversion Rate
- **1 USD = 1,500 NGN**
- All prices stored in backend can remain in USD
- Frontend handles conversion display

### API Endpoints (No change needed)
- Backend continues to return prices in USD
- Frontend converts to NGN for display

---

## 5. Assessment/Test Links & Student Submissions

### Database Schema Changes
**Assessment Model:**
```typescript
{
  link?: string // External test link provided by facilitator
  status: "not_started" | "in_progress" | "completed"
}
```

**StudentAssessmentSubmission Model:**
```typescript
{
  id: string
  assessmentId: string
  studentId: string
  studentName: string
  submissionLink: string // Link provided by student
  submittedAt: Date
  status: "submitted" | "reviewed" | "graded"
  grade?: number
}
```

### API Endpoints Needed
- `POST /api/programs/{programId}/assessments/{assessmentId}/submissions` - Student submits their assessment link
- `GET /api/programs/{programId}/assessments/{assessmentId}/submissions` - Get all student submissions for an assessment
- `PUT /api/programs/{programId}/assessments/{assessmentId}/submissions/{submissionId}` - Update submission status/grade

---

## 6. Reviews & Ratings (Mentee Feedback)

### Database Schema Changes
**ProgramReview Model:**
```typescript
{
  id: string
  programId: string
  menteeId: string
  menteeName: string
  rating: number // 1-5 stars
  comment: string
  createdAt: Date
}
```

### API Endpoints Needed
- `POST /api/programs/{id}/reviews` - Submit review and rating
- `GET /api/programs/{id}/reviews` - Get all reviews for a program

---

## 7. Password Change

### API Endpoints Needed
- `PUT /api/user/password` - Change user password
  ```typescript
  Request: {
    currentPassword: string
    newPassword: string
  }
  ```

---

## 8. Mentor Assignment to Topics

### Database Schema Changes
**TopicMentorAssignment Model:**
```typescript
{
  topicId: string
  mentorId: string
  mentorName: string
  status: "assigned" | "active" | "completed"
}
```

**Topic Model - Updated:**
```typescript
{
  assignedMentors: Array<{
    id: string
    name: string
    email: string
    avatar: string
  }>
}
```

### API Endpoints Needed
- `POST /api/programs/{programId}/topics/{topicId}/mentors` - Assign mentor to topic
- `DELETE /api/programs/{programId}/topics/{topicId}/mentors/{mentorId}` - Remove mentor assignment

---

## 13. Session Attendance Confirmations (Student-Provided)

### Database Schema Changes
**SessionAttendanceConfirmation Model:**
```typescript
{
  id: string
  sessionId: string
  studentId: string
  studentName: string
  trainerPresent: boolean
  mentorPresent: boolean
  confirmedAt: Date
  additionalNotes?: string
}
```

**Session Model - Updated:**
```typescript
{
  trainerConfirmed: boolean // Aggregated from student confirmations
  mentorConfirmed: boolean // Aggregated from student confirmations
  attendanceConfirmations: Array<SessionAttendanceConfirmation>
}
```

### API Endpoints Needed
- `POST /api/sessions/{sessionId}/attendance` - Student submits attendance confirmation
- `GET /api/sessions/{sessionId}/attendance` - Get all attendance confirmations for a session
- Session confirmation status is calculated: confirmed if majority of students confirm attendance

---

## 9. Mentor Profile Updates

### Database Schema Changes
**Mentor Profile Model - Added Fields:**
```typescript
{
  selectedSector: string // Sector ID
  selectedSkills: string[] // Array of skill IDs
}
```

### API Endpoints Needed
- `PUT /api/mentor/profile` - Update to accept `selectedSector` and `selectedSkills`

---

## 10. External Resources

### Database Schema Changes
**ExternalResource Model:**
```typescript
{
  id: string
  topicId: string
  title: string
  url: string
  description?: string
  createdAt: Date
}
```

### API Endpoints Needed
- `POST /api/programs/{programId}/topics/{topicId}/resources` - Add external resource
- `GET /api/programs/{programId}/topics/{topicId}/resources` - Get resources for topic
- `DELETE /api/programs/{programId}/topics/{topicId}/resources/{resourceId}` - Delete resource

---

## 11. Settings/Navigation Changes

### Removed Endpoints (No longer needed)
- Mentee settings page removed (merged into profile)
- `/mentee/dashboard/settings` route deprecated

---

## 12. Onboarding Flow Updates

### Mentee Onboarding
- Skip button now creates account (not skip to dashboard)
- No API changes, just navigation flow

### Mentor Onboarding
- Skip to account creation
- "Explore Programs" shows mentor view
- No schema changes needed

### Trainer Onboarding
- Skip to account creation
- No schema changes needed

---

## 13. View Context (Mentor vs Mentee)

### Query Parameters
- `?view=mentor` - Show program from mentor perspective
- Frontend-only feature, no API changes needed

---

## Summary of Critical API Changes

### HIGH PRIORITY:
1. ✅ Add `isFree` field to topics/sessions
2. ✅ Add `freeSessionsIncluded` to programs
3. ✅ Free trial enrollment endpoint
4. ✅ Mentor application/interest endpoints
5. ✅ Prerequisites array for programs
6. ✅ Password change endpoint

### MEDIUM PRIORITY:
7. ✅ Reviews & ratings endpoints
8. ✅ Test link save endpoint
9. ✅ Mentor-to-topic assignment endpoints
10. ✅ External resources CRUD endpoints

### LOW PRIORITY:
11. ✅ Mentor profile sector/skills fields
12. ✅ Mentor compensation display (can be calculated from session rate)

---

## Testing Checklist

- [ ] Create program with free sessions marked
- [ ] Enroll in program as free trial
- [ ] Submit mentor interest for program
- [ ] Add prerequisites to program
- [ ] Change password
- [ ] Submit review and rating
- [ ] Add test link to assessment
- [ ] Assign mentor to topic
- [ ] Add external resource to topic
- [ ] Update mentor profile with sector/skills
