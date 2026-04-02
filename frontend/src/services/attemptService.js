import api from './api'

const attemptService = {
  submit: (data) => api.post('/attempts/submit', data).then(r => r.data),
  getMyAttempts: () => api.get('/attempts/my').then(r => r.data),
  getById: (id) => api.get(`/attempts/${id}`).then(r => r.data),
  getAllAttempts: () => api.get('/attempts/all').then(r => r.data),
}

export default attemptService
