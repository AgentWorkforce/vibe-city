import "server-only";

const API = "https://api.stripe.com/v1";
const MAX_PAGES = 10; // 100 records/page; revisit if contributions outgrow this

async function stripeGet(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ limit: "100", ...params });
  const res = await fetch(`${API}${path}?${qs}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`stripe ${path} ${res.status}`);
  return res.json() as Promise<{
    data: Array<Record<string, unknown>>;
    has_more: boolean;
  }>;
}

/**
 * Total raised in USD. With STRIPE_PAYMENT_LINK_ID set, sums paid checkout
 * sessions for that link only (use this when the Stripe account has other
 * traffic); otherwise sums every succeeded payment on the account.
 */
export async function fetchRaised(): Promise<number> {
  const linkId = process.env.STRIPE_PAYMENT_LINK_ID;
  let cents = 0;
  let after: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const params: Record<string, string> = after ? { starting_after: after } : {};
    if (linkId) params.payment_link = linkId;

    const body = linkId
      ? await stripeGet("/checkout/sessions", params)
      : await stripeGet("/payment_intents", params);

    for (const item of body.data) {
      if (linkId) {
        if (item.payment_status === "paid") cents += Number(item.amount_total) || 0;
      } else if (item.status === "succeeded") {
        cents += Number(item.amount_received) || 0;
      }
    }

    if (!body.has_more || body.data.length === 0) break;
    after = String(body.data[body.data.length - 1].id);
  }

  return cents / 100;
}
