const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CoursePrice({
  price,
  mrp,
  size = "md",
  showBadge = true,
}: {
  price: number;
  mrp?: number;
  size?: "sm" | "md" | "lg";
  /** Set false when a discount ribbon is already shown elsewhere (e.g. on the card image). */
  showBadge?: boolean;
}) {
  if (!price) return <span className="font-semibold text-navy">Contact for pricing</span>;

  const hasDiscount = !!mrp && mrp > price;
  const percentOff = hasDiscount ? Math.round(((mrp! - price) / mrp!) * 100) : 0;

  const priceSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-2xl";
  const mrpSize = size === "lg" ? "text-lg" : "text-sm";

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-bold text-navy ${priceSize}`}>{inr(price)}</span>
      {hasDiscount && (
        <span className={`text-ink/40 line-through ${mrpSize}`}>{inr(mrp!)}</span>
      )}
      {hasDiscount && showBadge && (
        <span className="rounded-full bg-signal/10 px-2 py-0.5 text-xs font-semibold text-signal-600">
          {percentOff}% OFF
        </span>
      )}
    </div>
  );
}
