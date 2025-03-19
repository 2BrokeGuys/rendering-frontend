import { stripe } from "@/lib/stripe";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  const { sub: userId } = session;

  const { product_name, product_price, product_id } = await request.json();

  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  const cancelUrl = request.headers.get("referer") as string;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${product_name} CC`,
              metadata: {
                id: product_id,
              },
            },
            unit_amount: product_price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { userId: userId as string, productId: product_id as string },
      success_url: `${protocol}://${host}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json(
      { paymentLink: checkoutSession.url },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error Generating Payment Link: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
