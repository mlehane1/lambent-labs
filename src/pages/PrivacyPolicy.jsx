export default function PrivacyPolicy() {
  const sectionTitle = {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: "1.3rem",
    color: "var(--text-hi)",
    marginTop: "2.5rem",
    marginBottom: "0.75rem",
  };

  const paragraph = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "var(--text-mid)",
    marginBottom: "1rem",
  };

  const list = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "var(--text-mid)",
    paddingLeft: "1.5rem",
    marginBottom: "1rem",
  };

  return (
    <div
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "3rem 1.5rem 4rem",
      }}
    >
      <h1
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: "2.2rem",
          color: "var(--text-hi)",
          marginBottom: "0.5rem",
        }}
      >
        Privacy Policy
      </h1>
      <p
        style={{
          ...paragraph,
          color: "var(--text-lo)",
          fontSize: "0.9rem",
          marginBottom: "2rem",
        }}
      >
        Last updated: April 7, 2026
      </p>

      <p style={paragraph}>
        doITbetter labs ("we," "us," or "our") respects your privacy. This
        Privacy Policy explains how we collect, use, and protect information
        when you visit our website at{" "}
        <a
          href="https://doitbetterlabs.com"
          style={{ color: "var(--accent)" }}
        >
          doitbetterlabs.com
        </a>{" "}
        (the "Site").
      </p>

      <h2 style={sectionTitle}>Information We Collect</h2>
      <p style={paragraph}>
        When you visit our Site, we may collect the following types of
        information:
      </p>
      <ul style={list}>
        <li>
          <strong>Contact information</strong> you voluntarily provide through
          our contact form, including your name, email address, company name,
          and project details.
        </li>
        <li>
          <strong>Usage data</strong> such as pages visited, time spent on the
          Site, scroll depth, button clicks, referral source, and UTM
          parameters.
        </li>
        <li>
          <strong>Device and network information</strong> including IP address,
          browser type, operating system, and approximate geographic location
          derived from your IP address.
        </li>
        <li>
          <strong>Business identification data</strong> — we use third-party
          services to identify the organization associated with your IP address
          (e.g., company name, industry). This helps us understand which
          businesses are interested in our services.
        </li>
      </ul>

      <h2 style={sectionTitle}>Cookies and Tracking Technologies</h2>
      <p style={paragraph}>
        We use cookies and similar technologies to recognize returning visitors,
        maintain session state, and analyze Site usage. These include:
      </p>
      <ul style={list}>
        <li>
          <strong>Session cookies</strong> to track your visit across pages.
        </li>
        <li>
          <strong>Google Analytics (GA4)</strong> and{" "}
          <strong>Google Tag Manager</strong> for website analytics and
          conversion tracking.
        </li>
        <li>
          <strong>Microsoft Clarity</strong> for session recordings and
          heatmaps.
        </li>
      </ul>

      <h2 style={sectionTitle}>
        Third-Party Visitor Identification
      </h2>
      <p style={paragraph}>
        When you visit or log in to our website, cookies and similar
        technologies may be used by our online data partners or vendors to
        associate these activities with other personal information they or
        others have about you, including by association with your email or home
        address. We (or service providers on our behalf) may then send
        communications and marketing to these email addresses. You may opt out
        of receiving this advertising by visiting{" "}
        <a
          href="https://app.retention.com/optout"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}
        >
          https://app.retention.com/optout
        </a>
        .
      </p>
      <p style={paragraph}>
        You also have the option to opt out of the collection of your personal
        data in compliance with GDPR by visiting{" "}
        <a
          href="https://www.rb2b.com/rb2b-gdpr-opt-out"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)" }}
        >
          https://www.rb2b.com/rb2b-gdpr-opt-out
        </a>
        .
      </p>

      <h2 style={sectionTitle}>How We Use Your Information</h2>
      <p style={paragraph}>We use the information we collect to:</p>
      <ul style={list}>
        <li>Respond to inquiries submitted through our contact form.</li>
        <li>
          Understand how visitors use our Site so we can improve content and
          user experience.
        </li>
        <li>
          Identify potential business leads and send relevant communications.
        </li>
        <li>
          Monitor Site security and detect unauthorized access or abuse.
        </li>
      </ul>

      <h2 style={sectionTitle}>Data Sharing</h2>
      <p style={paragraph}>
        We do not sell your personal information. We may share data with
        third-party service providers that help us operate and improve the Site,
        including:
      </p>
      <ul style={list}>
        <li>
          <strong>Supabase</strong> (database hosting)
        </li>
        <li>
          <strong>Google Analytics / Google Tag Manager</strong> (analytics)
        </li>
        <li>
          <strong>Microsoft Clarity</strong> (session analytics)
        </li>
        <li>
          <strong>IPinfo</strong> (IP-based business identification)
        </li>
        <li>
          <strong>RB2B / Retention.com</strong> (visitor identification)
        </li>
      </ul>

      <h2 style={sectionTitle}>Data Retention</h2>
      <p style={paragraph}>
        We retain visitor tracking data and form submissions for up to 24
        months. You may request deletion of your data at any time by contacting
        us.
      </p>

      <h2 style={sectionTitle}>Your Rights</h2>
      <p style={paragraph}>Depending on your location, you may have the right to:</p>
      <ul style={list}>
        <li>Access, correct, or delete your personal information.</li>
        <li>Opt out of tracking and data collection.</li>
        <li>Withdraw consent for marketing communications.</li>
      </ul>
      <p style={paragraph}>
        To exercise any of these rights, contact us at{" "}
        <a
          href="mailto:lambentlabs247@gmail.com"
          style={{ color: "var(--accent)" }}
        >
          lambentlabs247@gmail.com
        </a>
        .
      </p>

      <h2 style={sectionTitle}>Changes to This Policy</h2>
      <p style={paragraph}>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated revision date.
      </p>

      <h2 style={sectionTitle}>Contact Us</h2>
      <p style={paragraph}>
        If you have questions about this Privacy Policy, contact us at{" "}
        <a
          href="mailto:lambentlabs247@gmail.com"
          style={{ color: "var(--accent)" }}
        >
          lambentlabs247@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
