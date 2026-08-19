import axios from 'axios'

const api = axios.create({
  baseURL: 'https://racha-facil-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('racha-facil-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api