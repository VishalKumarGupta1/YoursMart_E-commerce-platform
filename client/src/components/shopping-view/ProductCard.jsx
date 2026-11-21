import StarIcon from "@mui/icons-material/Star";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const ProductCard = ({ product, handleGetProductDeatil, handleAddToCart }) => {
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;
  const isOnSale =
    Number(product?.salePrice) > 0 &&
    Number(product?.salePrice) < Number(product?.price);
  const discountPercent =
    isOnSale && Number(product?.price) > 0
      ? Math.round(
          ((Number(product.price) - Number(product.salePrice)) /
            Number(product.price)) *
            100
        )
      : 0;

  return (
    <article className="group flex h-full flex-col">
      <button
        type="button"
        onClick={() => handleGetProductDeatil?.(product?._id)}
        aria-label={`View ${product?.title || "product"}`}
        className="relative block w-full overflow-hidden bg-ivory text-left"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efe9df]">
          <img
            src={product?.image}
            alt={product?.title || ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/5" />

          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            {isOutOfStock && (
              <span className="bg-ink px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-ivory">
                Sold out
              </span>
            )}
            {isOnSale && !isOutOfStock && (
              <span className="bg-burgundy px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-ivory">
                {discountPercent}% off
              </span>
            )}
          </div>

          {isLowStock && !isOutOfStock && (
            <span className="absolute right-3 top-3 bg-paper/95 px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur">
              {product.totalStock} left
            </span>
          )}

          <span className="pointer-events-none absolute inset-x-4 bottom-4 hidden translate-y-3 items-center justify-center bg-paper/95 px-4 py-2.5 text-center text-[9px] uppercase tracking-[0.25em] text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
            Quick view
          </span>
        </div>
      </button>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] uppercase tracking-[0.22em] text-stone">
            {product?.brand || "YoursMart"}
            {product?.category ? ` — ${product.category}` : ""}
          </p>
          {product?.averageReview > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-stone">
              <StarIcon sx={{ fontSize: 12 }} className="text-champagne" />
              {Number(product.averageReview).toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 font-display text-base leading-snug text-ink sm:text-lg">
          {product?.title}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-display text-xl text-ink">
            ₹{formatPrice(product?.salePrice)}
          </span>
          {isOnSale && (
            <span className="text-xs text-stone line-through">
              ₹{formatPrice(product?.price)}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() =>
            handleAddToCart?.(product?._id, product?.totalStock)
          }
          className="mt-4 w-full border border-ink bg-transparent py-3 text-[9px] uppercase tracking-[0.25em] text-ink transition-colors duration-300 hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:border-line disabled:text-stone disabled:hover:bg-transparent"
        >
          {isOutOfStock ? "Sold out" : "Add to bag"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
