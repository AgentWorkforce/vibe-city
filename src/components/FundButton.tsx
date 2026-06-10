import clsx from "clsx";

export function FundButton({ size = "lg" }: { size?: "lg" | "md" }) {
  const href =
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ??
    "https://buy.stripe.com/REPLACE_ME";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group relative inline-block rounded-xl p-[3px] transition-transform hover:scale-[1.03] focus-visible:scale-[1.03]",
        "bg-[linear-gradient(120deg,#ff2e88,#ff6b35,#ffc55c)]",
        "shadow-[0_0_24px_rgba(255,107,53,0.45)] hover:shadow-[0_0_48px_rgba(255,197,92,0.6)]",
      )}
    >
      <span
        className={clsx(
          "block rounded-[10px] bg-ink font-display font-black uppercase tracking-[0.12em] text-cream",
          size === "lg" ? "px-10 py-5 text-2xl sm:px-14 sm:text-4xl" : "px-6 py-3 text-xl",
        )}
      >
        Fund API Tokens
      </span>
    </a>
  );
}
