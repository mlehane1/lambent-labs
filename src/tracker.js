// Lightweight visitor event tracker — all fire-and-forget
const TRACK_URL = '/api/track'

async function track(eventType, data = {}) {
  try {
    await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        event_type: eventType,
        page_path: window.location.pathname,
        event_data: data,
      }),
    })
  } catch {} // fire-and-forget
}

export function trackPageView() {
  track('page_view', { referrer: document.referrer })
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
