import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const resendFrom =
  process.env.RESEND_FROM_EMAIL || "DealDrop <alerts@dealdrop.com>";

export async function sendPriceDropAlert(
  userEmail: string,
  product: {
    id: string;
    name: string;
    url: string;
    platform: string;
    currency: string;
  },
  oldPrice: number,
  newPrice: number,
) {
  try {
    const subject = `Price dropped: ${product.name}`;
    const idempotencyKey = `price-drop/${product.id}/${newPrice}`;
    const safeOld = Number.isFinite(oldPrice) ? oldPrice : "N/A";

    const { data, error } = await resend.emails.send(
      {
        from: resendFrom,
        to: [userEmail],
        subject,
        html: `
                <div style="background-color: #FFFDF5; padding: 40px; font-family: sans-serif; color: #000; line-height: 1.5;">
                <div style="max-width: 600px; margin: 0 auto; border: 4px solid #000; background-color: #fff; box-shadow: 8px 8px 0px 0px #000;">
                    <div style="background-color: #FFD93D; border-bottom: 4px solid #000; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">Price Alert!</h1>
                    </div>
                    <div style="padding: 30px;">
                    <div style="border: 4px solid #000; padding: 20px; background-color: #C4B5FD; box-shadow: 4px 4px 0px 0px #000; margin-bottom: 24px;">
                        <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 900; line-height: 1.2;">${product.name}</h2>
                        <div style="margin-top: 16px;">
                        <span style="background-color: #86EFAC; border: 2px solid #000; padding: 4px 12px; font-weight: 900; font-size: 24px; display: inline-block;">${product.currency} ${newPrice}</span>
                        <span style="text-decoration: line-through; color: rgba(0,0,0,0.5); font-weight: 700; margin-left: 12px; font-size: 16px;">${product.currency} ${safeOld}</span>
                        </div>
                    </div>
                    <p style="font-weight: 700; margin-bottom: 24px;">Good news! One of your tracked products just hit a lower price. Grab it before it goes back up!</p>
                    <a href="${product.url}" target="_blank" style="display: block; text-align: center; background-color: #FF6B6B; border: 4px solid #000; padding: 16px; color: #000; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; box-shadow: 4px 4px 0px 0px #000;">View on ${(product.platform || "daraz").toUpperCase()}</a>
                    </div>
                    <div style="border-top: 4px solid #000; padding: 15px; background-color: #000; color: #fff; text-align: center; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    Powered by DealDrop
                    </div>
                </div>
                </div>
                `.trim(),
        tags: [
          { name: "event", value: "price_drop" },
          { name: "product_id", value: String(product.id) },
        ],
      },
      { idempotencyKey },
    );

    if (error) {
      console.error("Resend send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendPriceDropAlert:", error);
    return { success: false, error };
  }
}
