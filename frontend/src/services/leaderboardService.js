import api from './api'

const leaderboardService = {
  getGlobal: () => api.get('/leaderboard').then(r => r.data),
  getByQuiz: (quizId) => api.get(`/leaderboard/quiz/${quizId}`).then(r => r.data),
}

export default leaderboardService
