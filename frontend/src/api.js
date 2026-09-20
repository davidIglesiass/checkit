const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, { method = 'GET', token, body } = {}) {
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-access-token': token } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`)
  return data
}

export const signUp = (payload) => request('/api/auth/signup', { method: 'POST', body: payload })
export const signIn = (payload) => request('/api/auth/signin', { method: 'POST', body: payload })

export const listTasks = (token, query = '') => request(`/api/tasks${query}`, { token })
export const createTask = (token, payload) => request('/api/tasks', { method: 'POST', token, body: payload })
export const updateTask = (token, id, payload) => request(`/api/tasks/${id}`, { method: 'PUT', token, body: payload })
export const deleteTask = (token, id) => request(`/api/tasks/${id}`, { method: 'DELETE', token })
