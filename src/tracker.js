// Lightweight visitor event tracker — all fire-and-forget
const TRACK_URL = '/api/track'

function getSessionId() {
  let id = sessionStorage.getItem('visitor_sid')
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem('visitor_sid', id)
  }
  return id
}

// Persist UTMs in sessionStorage so they survive page navigation
function captureUTMs() {
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid']
  keys.forEach(k => {
    const v = params.get(k)
    if (v) sessionStorage.setItem(k, v)
  })
}

export function getStoredUTMs() {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid']
  const result = {}
  keys.forEach(k => { result[k] = sessionStorage.getItem(k) || null })
  return result
}

async function track(eventType, data = {}) {
  try {
    await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: eventType,
        page_path: window.location.pathname,
        event_data: data,
      }),
    })
  } catch {} // fire-and-forget
}

export function trackPageView() {
  captureUTMs()
  const utms = getStoredUTMs()
  track('page_view', {
    referrer: document.referrer,
    ...utms,
  })
}

export function trackScrollDepth(depth) {
  track('scroll_depth', { depth })
}

export function trackCTAClick(ctaName, location) {
  track('cta_click', { cta: ctaName, location })
}

export function trackFormStart(formName) {
  track('form_start', { form: formName })
}

export function trackFormSubmit(formName) {
  track('form_submit', { form: formName })
}
