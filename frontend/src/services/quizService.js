import api from './api'

const quizService = {
  getAll: () => api.get('/quizzes').then(r => r.data),
  getById: (id) => api.get(`/quizzes/${id}`).then(r => r.data),
  create: (data) => api.post('/quizzes', data).then(r => r.data),
  update: (id, data) => api.put(`/quizzes/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/quizzes/${id}`).then(r => r.data),
  getQuestions: (quizId) => api.get(`/questions/quiz/${quizId}`).then(r => r.data),
  createQuestion: (data) => api.post('/questions', data).then(r => r.data),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data).then(r => r.data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`).then(r => r.data),
}

export default quizService
