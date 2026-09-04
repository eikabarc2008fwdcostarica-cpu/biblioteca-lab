import { API_URL } from '../config/api'

export { API_URL }

export const apiPath = (path) => `${API_URL}${path}`

const isJSON = (res) =>
  (res.headers.get('content-type') || '').includes('application/json')

export const fetchJSON = async (path, { method = 'GET', body } = {}) => {
  const res = await fetch(apiPath(path), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const data = isJSON(res) ? await res.json() : null

  if (!res.ok) {
    const detail =
      (data && (data.message || data.error)) || res.statusText || 'Error de red'
    throw new Error(`HTTP ${res.status}: ${detail}`)
  }

  return data
}
