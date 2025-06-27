import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return Response.json(
      { error: "Missing unsubscribe token in request body." },
      { status: 400 }
    );
  }

  try {
    // Find user with the unsubscribe token
    const user = await prisma.user.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid unsubscribe token." },
        { status: 404 }
      );
    }

    // Update user to unsubscribe from newsletter
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isNewsletterSubscriber: false,
        unsubscribeToken: null, // Remove token after use
      },
    });

    return Response.json({
      message: "Successfully unsubscribed from newsletter.",
      email: user.email,
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      { error: "Missing unsubscribe token in query." },
      { status: 400 }
    );
  }

  try {
    // Find user with the unsubscribe token
    const user = await prisma.user.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid unsubscribe token." },
        { status: 404 }
      );
    }

    return Response.json({
      valid: true,
      email: user.email,
      isSubscribed: user.isNewsletterSubscriber,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
