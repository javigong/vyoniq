import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { getBaseUrl } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  
  if (!sig) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event;

  try {
    const body = await request.text();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('Processing checkout session completed:', session.id);

    const budgetId = session.metadata?.budgetId;
    const inquiryId = session.metadata?.inquiryId;

    if (!budgetId) {
      console.error('No budgetId found in session metadata');
      return;
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: {
        stripeSessionId: session.id,
      },
      data: {
        status: 'SUCCEEDED',
        stripePaymentId: session.payment_intent,
        paidAt: new Date(),
        paymentMethod: session.payment_method_types?.[0] || 'card',
        metadata: session,
      },
    });

    // Update budget status to PAID
    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: { status: 'PAID' },
      include: {
        inquiry: {
          select: {
            id: true,
            name: true,
            email: true,
            serviceType: true,
          },
        },
        items: true,
      },
    });

    // Update inquiry status to IN_PROGRESS since payment is completed
    if (inquiryId) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    // Send payment confirmation email
    await sendPaymentConfirmationEmail(budget, payment, session);

    console.log(`Successfully processed payment for budget ${budgetId}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('Processing payment intent succeeded:', paymentIntent.id);
    
    // Update payment record if it exists
    await prisma.payment.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
      },
      data: {
        status: 'SUCCEEDED',
        paidAt: new Date(),
        metadata: paymentIntent,
      },
    });
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw error;
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log('Processing payment intent failed:', paymentIntent.id);
    
    // Update payment record
    await prisma.payment.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
      },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
        metadata: paymentIntent,
      },
    });
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
    throw error;
  }
}

async function sendPaymentConfirmationEmail(budget: any, payment: any, session: any) {
  try {
    const totalAmount = Number(budget.totalAmount);
    const itemsList = budget.items.map((item: any) => 
      `<li>${item.name} (${item.quantity}x) - $${Number(item.totalPrice).toFixed(2)}</li>`
    ).join('');

    await resend.emails.send({
      from: "Vyoniq <noreply@vyoniq.com>",
      to: budget.inquiry.email,
      subject: "Payment Confirmed - Your Vyoniq Project is Starting!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your project is ready to begin</p>
          </div>
          
          <div style="padding: 40px 20px; background: #ffffff;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi ${budget.inquiry.name},</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
              Great news! We've confirmed your payment and your Vyoniq project is officially underway. 
              Our team will begin work immediately and keep you updated on progress.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
              <h3 style="color: #10B981; margin: 0 0 15px 0;">Payment Details</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Budget Title:</strong> ${budget.title}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Payment ID:</strong> ${payment.id}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Service Type:</strong> ${budget.inquiry.serviceType}</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3B82F6; margin: 0 0 15px 0;">Project Items</h3>
              <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
                ${itemsList}
              </ul>
            </div>
            
            <h3 style="color: #3B82F6; margin: 30px 0 15px 0;">What Happens Next?</h3>
            <ol style="color: #333; line-height: 1.6; margin-bottom: 25px;">
              <li>Our project manager will contact you within 24 hours</li>
              <li>We'll set up regular check-ins and progress updates</li>
              <li>Development will begin according to the agreed timeline</li>
              <li>You'll receive regular updates through your dashboard</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
                              <a href="${getBaseUrl()}/dashboard/inquiries/${budget.inquiry.id}" 
                 style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Project Status
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
              Have questions? Reply to this email or contact us at 
              <a href="mailto:support@vyoniq.com" style="color: #3B82F6;">support@vyoniq.com</a>
            </p>
            
            <p style="font-size: 16px; color: #333; margin-top: 30px;">
              Thank you for choosing Vyoniq!<br>
              <strong>The Vyoniq Team</strong>
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 0;">
              This email was sent from Vyoniq regarding your payment confirmation.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Payment confirmation email sent to ${budget.inquiry.email}`);
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    // Don't throw - email failure shouldn't fail the webhook
  }
}