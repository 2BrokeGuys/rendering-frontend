import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { creditPlans } from "@/lib/plans";
import { sql } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

export const POST = async (request: NextRequest) => {
  try {
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return new NextResponse("Missing Stripe signature", { status: 400 });
    }

    let event: Stripe.Event;

    const rawBody = await getRawBody(request.body as ReadableStream);

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const { userId, productId } = event.data.object
        .metadata as Stripe.Metadata;

      const stripe_payment_id = event.data.object.id;
      const amount = (event.data.object.amount_total as number) / 100;

      const { credits } = creditPlans.find(
        (plan) => plan.productId === productId,
      )!;

      await sql`UPDATE users SET credits = credits + ${credits} WHERE user_id = ${userId};`;
      await sql`INSERT INTO transactions (user_id, stripe_payment_id, amount, status, created_at, payment_method) VALUES (${userId}, ${stripe_payment_id}, ${amount}, 'Success', NOW(), 'card');`;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook Error: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
