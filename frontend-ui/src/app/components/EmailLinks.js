export default function EmailLinks({ email, text, showAddress = false }) {
  if (!email) return null;
  return (
    <div className="email-actions">
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.trim())}`}
        target="_blank"
        rel="noopener noreferrer"
        title={text.composeGmail}
      >{showAddress ? email : text.emailLabel} ↗</a>
    </div>
  );
}
