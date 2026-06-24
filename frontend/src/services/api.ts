const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`)

  if (!response.ok) {
    throw new Error('Unable to reach the D-CUBE API.')
  }

  return response.json() as Promise<{ status: string; service: string }>
}
