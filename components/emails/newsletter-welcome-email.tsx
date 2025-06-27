import * as React from "react";

interface NewsletterWelcomeEmailProps {
  email: string;
  unsubscribeToken: string;
}

export const NewsletterWelcomeEmail: React.FC<
  Readonly<NewsletterWelcomeEmailProps>
> = ({ email, unsubscribeToken }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#1a1a1a", margin: "0" }}>
        Welcome to the{" "}
        <a
          href="https://vyoniq.com/"
          style={{ color: "#6E56CF", textDecoration: "none" }}
        >
          Vyoniq
        </a>{" "}
        Newsletter!
      </h1>
    </div>

    <div style={{ padding: "30px 20px" }}>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Thank you for subscribing to our newsletter! We're excited to share the
        latest insights on AI, software development, and cutting-edge technology
        with you.
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        You'll receive updates about:
      </p>

      <ul
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#333",
          paddingLeft: "20px",
        }}
      >
        <li>Latest AI development trends and insights</li>
        <li>Software development best practices</li>
        <li>Vyoniq Apps updates and early access opportunities</li>
        <li>Industry analysis and thought leadership</li>
      </ul>

      <div
        style={{
          backgroundColor: "#f0f9ff",
          padding: "20px",
          borderRadius: "8px",
          margin: "30px 0",
        }}
      >
        <h3 style={{ color: "#1e40af", margin: "0 0 10px 0" }}>What's Next?</h3>
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#1e40af",
            margin: "0",
          }}
        >
          Keep an eye on your inbox for our latest insights and updates. We
          promise to only send valuable content and respect your time.
        </p>
      </div>

      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        We're thrilled to have you as part of the Vyoniq community!
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        Best regards,
        <br />
        The Vyoniq Team
      </p>
    </div>

    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        fontSize: "12px",
        color: "#666",
        textAlign: "center",
      }}
    >
      <p style={{ margin: "0 0 10px 0" }}>
        You're receiving this email because you subscribed to the Vyoniq
        newsletter with the email address: {email}
      </p>
      <p style={{ margin: "0" }}>
        <a
          href={`https://vyoniq.com/unsubscribe?token=${unsubscribeToken}`}
          style={{ color: "#666" }}
        >
          Unsubscribe from this newsletter
        </a>{" "}
        |
        <a
          href="https://vyoniq.com/privacy"
          style={{ color: "#666", marginLeft: "10px" }}
        >
          Privacy Policy
        </a>
      </p>
    </div>
  </div>
);
