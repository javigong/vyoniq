import * as React from "react";

interface NewsletterEmailProps {
  subject: string;
  content: string;
  email: string;
  unsubscribeToken: string;
  previewText?: string;
}

export const NewsletterEmail: React.FC<Readonly<NewsletterEmailProps>> = ({
  subject,
  content,
  email,
  unsubscribeToken,
  previewText,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    {/* Preview text for email clients */}
    {previewText && (
      <div
        style={{
          display: "none",
          fontSize: "1px",
          color: "transparent",
          lineHeight: "1px",
          maxHeight: "0px",
          maxWidth: "0px",
          opacity: "0",
          overflow: "hidden",
        }}
      >
        {previewText}
      </div>
    )}

    {/* Header */}
    <div
      style={{
        backgroundColor: "#121212",
        padding: "30px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          margin: "0",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        <a
          href="https://vyoniq.com/"
          style={{ color: "#ffffff", textDecoration: "none" }}
        >
          vyoniq
        </a>
      </h1>
      <p style={{ color: "#00C7B7", margin: "10px 0 0 0", fontSize: "14px" }}>
        AI-powered software solutions for the future
      </p>
    </div>

    {/* Main Content */}
    <div style={{ backgroundColor: "#ffffff", padding: "40px 30px" }}>
      <h2
        style={{
          color: "#1a1a1a",
          margin: "0 0 20px 0",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {subject}
      </h2>

      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#333",
          marginBottom: "30px",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Call to Action */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <a
          href="https://vyoniq.com/blog"
          style={{
            backgroundColor: "#6E56CF",
            color: "#ffffff",
            padding: "12px 30px",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Read More on Our Blog
        </a>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e5e5e5",
          margin: "30px 0",
        }}
      />

      {/* Additional Resources */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{ color: "#1a1a1a", margin: "0 0 15px 0", fontSize: "18px" }}
        >
          Stay Connected
        </h3>
        <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#666" }}>
          Follow us for the latest updates and insights:
        </p>
        <div style={{ textAlign: "center" }}>
          <a
            href="https://vyoniq.com/blog"
            style={{
              color: "#6E56CF",
              textDecoration: "none",
              margin: "0 15px",
            }}
          >
            Blog
          </a>
          <a
            href="https://vyoniq.com/services"
            style={{
              color: "#6E56CF",
              textDecoration: "none",
              margin: "0 15px",
            }}
          >
            Services
          </a>
          <a
            href="https://vyoniq.com/vyoniq-apps"
            style={{
              color: "#6E56CF",
              textDecoration: "none",
              margin: "0 15px",
            }}
          >
            Vyoniq Apps
          </a>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      style={{
        backgroundColor: "#f8f9fa",
        padding: "30px 20px",
        fontSize: "12px",
        color: "#666",
        textAlign: "center",
      }}
    >
      <p style={{ margin: "0 0 10px 0" }}>
        <strong>Vyoniq Technologies</strong>
        <br />
        AI-powered software solutions for the future of business
      </p>
      <p style={{ margin: "0 0 15px 0" }}>
        You're receiving this email because you subscribed to our newsletter
        with: {email}
      </p>
      <div style={{ margin: "15px 0" }}>
        <a
          href="https://vyoniq.com"
          style={{ color: "#666", textDecoration: "none", margin: "0 10px" }}
        >
          Website
        </a>
        <a
          href="https://vyoniq.com/privacy"
          style={{ color: "#666", textDecoration: "none", margin: "0 10px" }}
        >
          Privacy Policy
        </a>
        <a
          href="https://vyoniq.com/terms"
          style={{ color: "#666", textDecoration: "none", margin: "0 10px" }}
        >
          Terms
        </a>
      </div>
      <p style={{ margin: "15px 0 0 0" }}>
        <a
          href={`https://vyoniq.com/unsubscribe?token=${unsubscribeToken}`}
          style={{ color: "#666" }}
        >
          Unsubscribe from this newsletter
        </a>
      </p>
    </div>
  </div>
);
