import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AssessmentProvider } from './context/AssessmentContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentInstructions from './pages/assessment/AssessmentInstructions';
import AssessmentQuiz from './pages/assessment/AssessmentQuiz';
import AssessmentReview from './pages/assessment/AssessmentReview';
import AssessmentResult from './pages/assessment/AssessmentResult';
import ResumeDashboard from './pages/resume/ResumeDashboard';
import ResumeUpload from './pages/resume/ResumeUpload';
import ResumePreview from './pages/resume/ResumePreview';
import ResumeParsing from './pages/resume/ResumeParsing';
import ResumeEditor from './pages/resume/ResumeEditor';
import ResumeAnalysis from './pages/resume/ResumeAnalysis';
import ResumeHistory from './pages/resume/ResumeHistory';
import AdminLayout from './layouts/AdminLayout';
import { AdminDashboard, PlaceholderPage, QuestionsPage, ResumesPage, StudentsPage } from './pages/admin/AdminPages';
import MentorLayout from './layouts/MentorLayout';
import { AssessmentPage, MentorDashboard, Placeholder, ResumePage, StudentsPage as MentorStudentsPage } from './pages/mentor/MentorPages';
import { BecomeMentor, MentorRegistration, MentorStatus } from './pages/mentor/MentorVerification';
import MentorVerificationPage from './pages/admin/MentorVerificationPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AssessmentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login"           element={<LoginPage />} />
              <Route path="/register"        element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password"  element={<ResetPasswordPage />} />
              <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile"         element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/assessment"      element={<ProtectedRoute><AssessmentInstructions /></ProtectedRoute>} />
              <Route path="/assessment/quiz" element={<ProtectedRoute><AssessmentQuiz /></ProtectedRoute>} />
              <Route path="/assessment/review" element={<ProtectedRoute><AssessmentReview /></ProtectedRoute>} />
              <Route path="/assessment/result" element={<ProtectedRoute><AssessmentResult /></ProtectedRoute>} />
              <Route path="/resume" element={<ProtectedRoute><ResumeDashboard /></ProtectedRoute>} />
              <Route path="/resume/upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
              <Route path="/resume/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
              <Route path="/resume/parsing" element={<ProtectedRoute><ResumeParsing /></ProtectedRoute>} />
              <Route path="/resume/editor" element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>} />
              <Route path="/resume/analysis" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
              <Route path="/resume/history" element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
              <Route path="/become-mentor" element={<BecomeMentor />} />
              <Route path="/mentor/register" element={<MentorRegistration />} />
              <Route path="/mentor/status" element={<ProtectedRoute><MentorStatus /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<StudentsPage mode="users" />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="assessments" element={<QuestionsPage />} />
                <Route path="resumes" element={<ResumesPage />} />
                <Route path="mentors" element={<MentorVerificationPage />} />
                <Route path="careers" element={<PlaceholderPage title="Career management" description="Manage career paths, recommendations and eligibility criteria." />} />
                <Route path="skills" element={<PlaceholderPage title="Skills management" description="Maintain the skills taxonomy used across assessments and profiles." />} />
                <Route path="reports" element={<PlaceholderPage title="Reports & analytics" description="Generate and export platform performance reports." />} />
                <Route path="settings" element={<PlaceholderPage title="Settings" description="Configure administrative preferences and notification rules." />} />
              </Route>
              <Route path="/mentor" element={<ProtectedRoute><MentorLayout /></ProtectedRoute>}>
                <Route index element={<MentorDashboard />} />
                <Route path="students" element={<MentorStudentsPage />} />
                <Route path="profiles" element={<MentorStudentsPage profiles />} />
                <Route path="assessments" element={<AssessmentPage />} />
                <Route path="resumes" element={<ResumePage />} />
                <Route path="feedback" element={<Placeholder title="Feedback history" description="Review all feedback provided to your assigned students." />} />
                <Route path="messages" element={<Placeholder title="Messages" description="Stay in touch with your assigned students." />} />
                <Route path="profile" element={<Placeholder title="Mentor profile" description="Manage your professional profile and areas of expertise." />} />
              </Route>
              <Route path="*"                element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AssessmentProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
