const DEFAULT_HEADERS = {
  Accept: 'application/json',
}

async function readErrorBody(res) {
  const ct = res.headers.get('content-type') || ''
  try {
    if (ct.includes('application/json')) {
      const j = await res.json()
      return typeof j?.detail === 'string' ? j.detail : JSON.stringify(j)
    }
    return await res.text()
  } catch {
    return ''
  }
}

export async function fetchJson(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await readErrorBody(res)
    const msg = body ? `${res.status} ${res.statusText}: ${body}` : `${res.status} ${res.statusText}`
    const err = new Error(msg)
    err.status = res.status
    throw err
  }

  if (res.status === 204) return null
  return await res.json()
}

