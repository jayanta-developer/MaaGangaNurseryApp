import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

type OrderPayload = {
  productSlug?: unknown;
  name?: unknown;
  phone?: unknown;
  address?: unknown;
  pinCode?: unknown;
  quantity?: unknown;
};

function isText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderPayload;
    const productSlug = isText(body.productSlug, 160) ? body.productSlug.trim() : "";
    const name = isText(body.name, 100) ? body.name.trim() : "";
    const phone = isText(body.phone, 20) ? body.phone.trim() : "";
    const address = isText(body.address, 500) ? body.address.trim() : "";
    const pinCode = isText(body.pinCode, 6) ? body.pinCode.trim() : "";
    const quantity = Number(body.quantity);
    const product = (await getProducts()).find((item) => item.slug === productSlug);

    if (!product || !name || !/^[0-9]{10}$/.test(phone) || !/^[0-9]{6}$/.test(pinCode) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || !address) {
      return NextResponse.json({ success: false, message: "Please check the order details and try again." }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram order notifications are not configured.");
      return NextResponse.json({ success: false, message: "Orders are temporarily unavailable. Please try again later." }, { status: 503 });
    }

    const message = [
      "🌱 New Order Request",
      "",
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      `Quantity: ${quantity}`,
      `Price: ${product.price}`,
      "",
      `Customer: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      `PIN: ${pinCode}`,
    ].join("\n");

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      cache: "no-store",
    });

    if (!telegramResponse.ok) {
      console.error("Telegram rejected the order notification.");
      return NextResponse.json({ success: false, message: "We could not submit your order. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "We could not submit your order. Please try again." }, { status: 400 });
  }
}