/*uma única URL base configurável por ambiente (.env); tratamento de 
erro consistente (o backend sempre responde `{ error, details? }`, e 
aqui isso vira uma exceção tipada); timeout automático, evitando 
requisições penduradas para sempre.*/

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const DEFAULT_TIMEOUT_MS = 10_000

export class ApiRequestError extends Error {
  status: number
  details?: Array<{ campo: string; mensagem: string }>

  constructor(status: number, message: string, details?: Array<{ campo: string; mensagem: string }>) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.details = details
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(`${API_URL}${path}`)
  if(query) {
    for(const [key, value] of Object.entries(query)) {
      if(value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })
    const isJson = response.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await response.json() : null

    if(!response.ok) {
      throw new ApiRequestError(
        response.status,
        payload?.error ?? 'Ocorreu um erro inesperado. Tente novamente.',
        payload?.details
      )
    }
    return payload as T
  }catch(error) {
    if(error instanceof ApiRequestError) throw error

    if(error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError(0, 'A requisição demorou demais e foi cancelada. Verifique sua conexão.')
    }
    throw new ApiRequestError(0, 'Não foi possível conectar ao servidor. Verifique sua conexão.')
  } finally {
    clearTimeout(timeout)
  }
}
