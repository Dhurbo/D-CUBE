import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

export async function getHealth() {
  const { data } = await api.get<{ status: string }>('/health')
  return data
}
