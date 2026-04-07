import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { trackPageView } from './tracker.js'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import CaseManagement from './pages/CaseManagement.jsx'
import SmallBusiness from './pages/SmallBusiness.jsx'
import WhiteGlove from './pages/WhiteGlove.jsx'
import Franchise from './pages/Franchise.jsx'
import BlogIndex from './pages/BlogIndex.jsx'
import CustomSoftwareCost from './pages/blog/CustomSoftwareCost.jsx'
import BuildVsBuy from './pages/blog/BuildVsBuy.jsx'
import AIAcceleratedDev from './pages/blog/AIAcceleratedDev.jsx'
import FranchiseSoftwareSigns from './pages/blog/FranchiseSoftwareSigns.jsx'
import HighCodeLowCodeAI from './pages/blog/HighCodeLowCodeAI.jsx'
import AITrustGap from './pages/blog/AITrustGap.jsx'
import AICostCollapse from './pages/blog/AICostCollapse.jsx'
import AIAgentsGuide from './pages/blog/AIAgentsGuide.jsx'
import DynamicBlogPost from './pages/DynamicBlogPost.jsx'
import AdsLanding from './pages/AdsLanding.jsx'
import Websites from './pages/Websites.jsx'
import BuildPreview from './pages/BuildPreview.jsx'
import DataExtraction from './pages/DataExtraction.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import './index.css'

function PageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    trackPageView()
    // Scroll to top on route change (unless it's a hash link)
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        {/* Homepage keeps its own nav/footer */}
        <Route path="/" element={<App />} />

        {/* All other pages use shared Layout */}
        <Route element={<Layout />}>
          <Route path="/solutions/case-management" element={<CaseManagement />} />
          <Route path="/solutions/small-business" element={<SmallBusiness />} />
          <Route path="/solutions/white-glove" element={<WhiteGlove />} />
          <Route path="/solutions/franchise" element={<Franchise />} />
          <Route path="/solutions/websites" element={<Websites />} />
          <Route path="/solutions/data-extraction" element={<DataExtraction />} />
          <Route path="/build" element={<BuildPreview />} />
          <Route path="/get-quote" element={<AdsLanding />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/custom-software-cost" element={<CustomSoftwareCost />} />
          <Route path="/blog/build-vs-buy" element={<BuildVsBuy />} />
          <Route path="/blog/ai-accelerated-development" element={<AIAcceleratedDev />} />
          <Route path="/blog/franchise-software-signs" element={<FranchiseSoftwareSigns />} />
          <Route path="/blog/high-code-low-code-ai" element={<HighCodeLowCodeAI />} />
          <Route path="/blog/ai-trust-gap" element={<AITrustGap />} />
          <Route path="/blog/ai-cost-collapse" element={<AICostCollapse />} />
          <Route path="/blog/ai-agents-guide" element={<AIAgentsGuide />} />
          <Route path="/blog/:slug" element={<DynamicBlogPost />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  </React.StrictMode>
)
