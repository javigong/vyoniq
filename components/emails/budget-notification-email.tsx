import React from "react";

interface BudgetItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

interface Budget {
  id: string;
  title: string;
  description?: string;
  totalAmount: number;
  currency: string;
  validUntil?: Date | null;
  adminNotes?: string;
  items: BudgetItem[];
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
}

interface BudgetNotificationEmailProps {
  budget: Budget;
  baseUrl: string;
}

export function BudgetNotificationEmail({
  budget,
  baseUrl,
}: BudgetNotificationEmailProps) {
  const currencySymbol = budget.currency === "CAD" ? "CA$" : "$";
  const totalAmount = Number(budget.totalAmount);

  const itemsList = budget.items
    .map(
      (item: BudgetItem) =>
        `<li style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
          <strong>${item.name}</strong> (${item.quantity}x)
          ${
            item.description
              ? `<br/><span style="color: #666; font-size: 14px;">${item.description}</span>`
              : ""
          }
          <br/><span style="color: #10B981; font-weight: bold;">${currencySymbol}${Number(
          item.totalPrice
        ).toFixed(2)}</span>
        </li>`
    )
    .join("");

  const validUntilText = budget.validUntil
    ? new Date(budget.validUntil).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No expiration";

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "white", margin: "0", fontSize: "28px" }}>
          New Budget Proposal
        </h1>
        <p style={{ color: "white", margin: "10px 0 0 0", opacity: "0.9" }}>
          Your custom project estimate is ready for review
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 20px", background: "#ffffff" }}>
        <p style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>
          Hi {budget.inquiry.name},
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#333",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          Great news! We've prepared a custom budget proposal for your{" "}
          <strong>{budget.inquiry.serviceType}</strong> project. Please review
          the details below and let us know if you'd like to proceed.
        </p>

        {/* Budget Summary */}
        <div
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            borderLeft: "4px solid #3B82F6",
            margin: "20px 0",
          }}
        >
          <h3 style={{ color: "#3B82F6", margin: "0 0 15px 0" }}>
            Budget Summary
          </h3>
          <p style={{ margin: "5px 0", color: "#666" }}>
            <strong>Project:</strong> {budget.title}
          </p>
          {budget.description && (
            <p style={{ margin: "5px 0", color: "#666" }}>
              <strong>Description:</strong> {budget.description}
            </p>
          )}
          <p style={{ margin: "5px 0", color: "#666" }}>
            <strong>Total Amount:</strong> {currencySymbol}
            {totalAmount.toFixed(2)} {budget.currency}
          </p>
          <p style={{ margin: "5px 0", color: "#666" }}>
            <strong>Valid Until:</strong> {validUntilText}
          </p>
        </div>

        {/* Project Items */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px 0",
          }}
        >
          <h3 style={{ color: "#3B82F6", margin: "0 0 15px 0" }}>
            Project Breakdown
          </h3>
          <ul
            style={{
              color: "#333",
              lineHeight: "1.6",
              margin: "0",
              paddingLeft: "0",
              listStyle: "none",
            }}
          >
            {budget.items.map((item, index) => (
              <li
                key={item.id || index}
                style={{
                  margin: "8px 0",
                  padding: "12px",
                  background: "#f8f9fa",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: "1" }}>
                    <strong style={{ color: "#1f2937", fontSize: "16px" }}>
                      {item.name}
                    </strong>
                    {item.description && (
                      <div
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          margin: "4px 0",
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                    <div style={{ color: "#666", fontSize: "14px" }}>
                      Quantity: {item.quantity} × {currencySymbol}
                      {Number(item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#10B981",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginLeft: "15px",
                    }}
                  >
                    {currencySymbol}
                    {Number(item.totalPrice).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div
            style={{
              borderTop: "2px solid #3B82F6",
              marginTop: "15px",
              paddingTop: "15px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              Total: {currencySymbol}
              {totalAmount.toFixed(2)} {budget.currency}
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        {budget.adminNotes && (
          <div
            style={{
              background: "#fffbeb",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: "4px solid #f59e0b",
              margin: "20px 0",
            }}
          >
            <h4 style={{ color: "#f59e0b", margin: "0 0 10px 0" }}>
              Additional Notes
            </h4>
            <p style={{ color: "#92400e", margin: "0", fontSize: "14px" }}>
              {budget.adminNotes}
            </p>
          </div>
        )}

        {/* Next Steps */}
        <h3 style={{ color: "#3B82F6", margin: "30px 0 15px 0" }}>
          Next Steps
        </h3>
        <ol style={{ color: "#333", lineHeight: "1.6", marginBottom: "25px" }}>
          <li>Review the budget details above</li>
          <li>Click the button below to approve or request changes</li>
          <li>Once approved, you'll receive payment instructions</li>
          <li>After payment, we'll begin work immediately</li>
        </ol>

        {/* Action Buttons */}
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={`${baseUrl}/dashboard/budgets`}
            style={{
              background: "#10B981",
              color: "white",
              padding: "15px 30px",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              display: "inline-block",
              marginRight: "10px",
            }}
          >
            Review & Approve Budget
          </a>
        </div>

        {/* Contact Info */}
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            lineHeight: "1.6",
            marginTop: "30px",
          }}
        >
          Have questions about this budget? Reply to this email or contact us at{" "}
          <a href="mailto:support@vyoniq.com" style={{ color: "#3B82F6" }}>
            support@vyoniq.com
          </a>
        </p>

        <p style={{ fontSize: "16px", color: "#333", marginTop: "30px" }}>
          Best regards,
          <br />
          <strong>The Vyoniq Team</strong>
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: "0" }}>
          This email was sent from Vyoniq regarding your project budget
          proposal.
        </p>
      </div>
    </div>
  );
}
