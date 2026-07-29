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
              <Route path="*"                element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AssessmentProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
