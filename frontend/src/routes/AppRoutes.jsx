import { Routes, Route } from 'react-router-dom'
import NavBar from '../components/navBar'
import ProtectedRoute from '../components/protectedRoute'
import AdminRoute from '../components/adminRoute'

import HomePage from '../pages/homePage'
import LoginPage from '../pages/loginPage'
import RegisterPage from '../pages/registerPage'
import QuizPage from '../pages/quizPage'
import ResultPage from '../pages/resultPage'
import LeaderboardPage from '../pages/leaderboardPage'
import AdminDashboard from '../pages/adminDashboard'
import AdminCreateQuiz from '../pages/adminCreateQuiz'
import AdminScores from '../pages/adminScores'

export default function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected user routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/result/:attemptId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

        {/* Admin-only routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/quiz/new" element={<AdminRoute><AdminCreateQuiz /></AdminRoute>} />
        <Route path="/admin/quiz/:id/edit" element={<AdminRoute><AdminCreateQuiz /></AdminRoute>} />
        <Route path="/admin/scores" element={<AdminRoute><AdminScores /></AdminRoute>} />
      </Routes>
    </>
  )
}
