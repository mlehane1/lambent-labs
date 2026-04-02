import emailjs from "@emailjs/browser";

export function sendLeadNotification(name, email, message, source) {
  emailjs.send("service_xzp77wo", "template_cmthcco", {
    from_name: name,
    from_email: email,
    message: message,
    source: source,
  }, "sKxPbJbb8JutpwYcg").catch(() => {}); // fire-and-forget
}
