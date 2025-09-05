import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
client.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Just log 401 errors, don't redirect automatically
    if (error.response?.status === 401) {
      console.log('Unauthorized request:', error.config.url)
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => client.post('/auth/login', { email, password }),
  register: (name, email, password) => client.post('/auth/register', { name, email, password }),
  logout: () => client.post('/auth/logout'),
  getMe: () => client.get('/auth/me'),
}

// Boards API
export const boardsAPI = {
  getAll: () => client.get('/boards'),
  getById: (id) => client.get(`/boards/${id}`),
  create: (data) => client.post('/boards', data),
  update: (id, data) => client.patch(`/boards/${id}`, data),
  delete: (id) => client.delete(`/boards/${id}`),
  createList: (boardId, title) => client.post(`/boards/${boardId}/lists`, { title }),
}

// Lists API
export const listsAPI = {
  update: (id, data) => client.patch(`/lists/${id}`, data),
  delete: (id) => client.delete(`/lists/${id}`),
}

// Tasks API
export const tasksAPI = {
  create: (listId, data) => client.post(`/tasks/lists/${listId}/tasks`, data),
  update: (id, data) => client.patch(`/tasks/${id}`, data),
  delete: (id) => client.delete(`/tasks/${id}`),
}

export default client
