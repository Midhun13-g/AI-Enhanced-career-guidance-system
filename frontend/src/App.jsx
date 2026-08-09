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
import MentorSignupPage from './pages/MentorSignupPage';
import PendingVerificationPage from './pages/PendingVerificationPage';

// Legacy assessment flow
import AssessmentInstructions from './pages/assessment/AssessmentInstructions';
import AssessmentQuiz from './pages/assessment/AssessmentQuiz';
import AssessmentReview from './pages/assessment/AssessmentReview';
import AssessmentResult from './pages/assessment/AssessmentResult';

// Module 4 — Student Assessment pages
import AssessmentDashboard from './pages/assessment/AssessmentDashboard';
import AssessmentCategories from './pages/assessment/AssessmentCategories';
import AssessmentDetails from './pages/assessment/AssessmentDetails';
import CodingAssessment from './pages/assessment/CodingAssessment';
import ResultAnalysis from './pages/assessment/ResultAnalysis';
import AIPerformanceAnalysis from './pages/assessment/AIPerformanceAnalysis';
import SkillVectorGrowth from './pages/assessment/SkillVectorGrowth';
import SkillGapAnalysis from './pages/assessment/SkillGapAnalysis';
import AssessmentHistory from './pages/assessment/AssessmentHistory';
import CertificatesBadges from './pages/assessment/CertificatesBadges';

// Resume
import ResumeDashboard from './pages/resume/ResumeDashboard';
import ResumeUpload from './pages/resume/ResumeUpload';
import ResumePreview from './pages/resume/ResumePreview';
import ResumeParsing from './pages/resume/ResumeParsing';
import ResumeEditor from './pages/resume/ResumeEditor';
import ResumeAnalysis from './pages/resume/ResumeAnalysis';
import ResumeHistory from './pages/resume/ResumeHistory';
import ResumeNLPResults from './pages/resume/ResumeNLPResults';
import ResumeSkillTaxonomy from './pages/resume/ResumeSkillTaxonomy';
import ResumeInsights from './pages/resume/ResumeInsights';
import ResumeSkillProfile from './pages/resume/ResumeSkillProfile';
import ResumeReport from './pages/resume/ResumeReport';

// Admin — Resume Intelligence
import ResumeAdminDashboard from './pages/admin/ResumeAdminDashboard';
import SkillTaxonomyAdmin from './pages/admin/SkillTaxonomyAdmin';
import NLPMonitoring from './pages/admin/NLPMonitoring';

// Admin
import AdminLayout from './layouts/AdminLayout';
import { AdminDashboard, PlaceholderPage, QuestionsPage, ResumesPage, StudentsPage } from './pages/admin/AdminPages';
import AdminAssessmentDashboard from './pages/admin/AdminAssessmentDashboard';
import CreateAssessment from './pages/admin/CreateAssessment';
import QuestionBankManagement from './pages/admin/QuestionBankManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import MentorVerificationPage from './pages/admin/MentorVerificationPage';

// Mentor
import MentorLayout from './layouts/MentorLayout';
import { AssessmentPage, MentorDashboard, Placeholder, ResumePage, StudentsPage as MentorStudentsPage } from './pages/mentor/MentorPages';
import { BecomeMentor, MentorRegistration, MentorStatus } from './pages/mentor/MentorVerification';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AssessmentProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Auth */}
              <Route path="/login"           element={<LoginPage />} />
              <Route path="/register"        element={<RegisterPage />} />
              <Route path="/mentor/signup" element={<MentorSignupPage />} />
              <Route path="/mentor/pending-verification" element={<ProtectedRoute><PendingVerificationPage /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password"  element={<ResetPasswordPage />} />

              {/* Core */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/student/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Legacy assessment flow */}
              <Route path="/assessment"        element={<ProtectedRoute><AssessmentInstructions /></ProtectedRoute>} />
              <Route path="/assessment/quiz"   element={<ProtectedRoute><AssessmentQuiz /></ProtectedRoute>} />
              <Route path="/assessment/review" element={<ProtectedRoute><AssessmentReview /></ProtectedRoute>} />
              <Route path="/assessment/result" element={<ProtectedRoute><AssessmentResult /></ProtectedRoute>} />

              {/* Module 4 — Student Assessment Engine */}
              <Route path="/assessments"              element={<ProtectedRoute><AssessmentDashboard /></ProtectedRoute>} />
              <Route path="/assessments/categories"   element={<ProtectedRoute><AssessmentCategories /></ProtectedRoute>} />
              <Route path="/assessments/details"      element={<ProtectedRoute><AssessmentDetails /></ProtectedRoute>} />
              <Route path="/assessments/coding"       element={<ProtectedRoute><CodingAssessment /></ProtectedRoute>} />
              <Route path="/assessments/result"       element={<ProtectedRoute><ResultAnalysis /></ProtectedRoute>} />
              <Route path="/assessments/ai-analysis"  element={<ProtectedRoute><AIPerformanceAnalysis /></ProtectedRoute>} />
              <Route path="/assessments/skill-growth" element={<ProtectedRoute><SkillVectorGrowth /></ProtectedRoute>} />
              <Route path="/assessments/skill-gap"    element={<ProtectedRoute><SkillGapAnalysis /></ProtectedRoute>} />
              <Route path="/assessments/history"      element={<ProtectedRoute><AssessmentHistory /></ProtectedRoute>} />
              <Route path="/assessments/certificates" element={<ProtectedRoute><CertificatesBadges /></ProtectedRoute>} />

              {/* Resume */}
              <Route path="/resume"          element={<ProtectedRoute><ResumeDashboard /></ProtectedRoute>} />
              <Route path="/resume/upload"   element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
              <Route path="/resume/preview"  element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
              <Route path="/resume/parsing"  element={<ProtectedRoute><ResumeParsing /></ProtectedRoute>} />
              <Route path="/resume/editor"   element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>} />
              <Route path="/resume/analysis" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
              <Route path="/resume/history"       element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
              <Route path="/resume/nlp-results"   element={<ProtectedRoute><ResumeNLPResults /></ProtectedRoute>} />
              <Route path="/resume/skill-taxonomy" element={<ProtectedRoute><ResumeSkillTaxonomy /></ProtectedRoute>} />
              <Route path="/resume/insights"       element={<ProtectedRoute><ResumeInsights /></ProtectedRoute>} />
              <Route path="/resume/skill-profile"  element={<ProtectedRoute><ResumeSkillProfile /></ProtectedRoute>} />
              <Route path="/resume/report"         element={<ProtectedRoute><ResumeReport /></ProtectedRoute>} />

              {/* Mentor verification */}
              <Route path="/become-mentor"  element={<BecomeMentor />} />
              <Route path="/mentor/register" element={<MentorRegistration />} />
              <Route path="/mentor/status"   element={<ProtectedRoute><MentorStatus /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users"    element={<StudentsPage mode="users" />} />
                <Route path="students" element={<StudentsPage />} />

                {/* Module 4 Admin pages */}
                <Route path="assessment-dashboard"   element={<AdminAssessmentDashboard />} />
                <Route path="assessments/create"     element={<CreateAssessment />} />
                <Route path="assessments/questions"  element={<QuestionBankManagement />} />
                <Route path="assessments/analytics"  element={<AdminAnalytics />} />
                <Route path="assessments"            element={<QuestionsPage />} />

                <Route path="resumes"              element={<ResumesPage />} />
                <Route path="resume-analytics"     element={<ResumeAdminDashboard />} />
                <Route path="skill-taxonomy"        element={<SkillTaxonomyAdmin />} />
                <Route path="nlp-monitoring"        element={<NLPMonitoring />} />
                <Route path="mentors"  element={<MentorVerificationPage />} />
                <Route path="careers"  element={<PlaceholderPage title="Career management" description="Manage career paths, recommendations and eligibility criteria." />} />
                <Route path="skills"   element={<PlaceholderPage title="Skills management" description="Maintain the skills taxonomy used across assessments and profiles." />} />
                <Route path="reports"  element={<PlaceholderPage title="Reports & analytics" description="Generate and export platform performance reports." />} />
                <Route path="settings" element={<PlaceholderPage title="Settings" description="Configure administrative preferences and notification rules." />} />
              </Route>

              {/* Mentor */}
              <Route path="/mentor" element={<ProtectedRoute><MentorLayout /></ProtectedRoute>}>
                <Route index element={<MentorDashboard />} />
                <Route path="students"   element={<MentorStudentsPage />} />
                <Route path="profiles"   element={<MentorStudentsPage profiles />} />
                <Route path="assessments" element={<AssessmentPage />} />
                <Route path="resumes"    element={<ResumePage />} />
                <Route path="feedback"   element={<Placeholder title="Feedback history" description="Review all feedback provided to your assigned students." />} />
                <Route path="messages"   element={<Placeholder title="Messages" description="Stay in touch with your assigned students." />} />
                <Route path="profile"    element={<Placeholder title="Mentor profile" description="Manage your professional profile and areas of expertise." />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AssessmentProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
