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
  const params = new URLSearchParams(window.location.search)
  track('page_view', {
    referrer: document.referrer,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
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
