import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const ProductCard = ({ product, handleGetProductDeatil, handleAddToCart }) => {
  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;
  const isOnSale = product?.salePrice < product?.price;

  return (
    <Card
      className="cursor-pointer h-full flex flex-col"
      sx={{
        width: "100%",
        maxWidth: 320,
        margin: "auto",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* IMAGE SECTION */}
      <div
        className="relative"
        onClick={() => handleGetProductDeatil(product?._id)}
      >
        {/* BADGES */}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        )}

        {isOnSale && !isOutOfStock && (
          <span className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}

        {isLowStock && !isOutOfStock && (
          <span className="absolute top-2 right-2 z-10 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            {product.totalStock} left
          </span>
        )}

        <CardMedia
          component="img"
          image={product?.image}
          alt={product?.title}
          className="h-[220px] w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <CardContent className="flex-1">
        <Typography variant="subtitle1" className="font-semibold line-clamp-2">
          {product?.title}
        </Typography>

        <Typography variant="body2" className="text-gray-500 mt-1 capitalize">
          {product?.brand} · {product?.category}
        </Typography>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-2">
          <Typography variant="h6" className="font-bold">
            ₹{product?.salePrice}
          </Typography>

          {isOnSale && (
            <Typography variant="body2" className="line-through text-gray-400">
              ₹{product?.price}
            </Typography>
          )}
        </div>
      </CardContent>

      {/* ACTION */}
      <CardActions className="px-4 pb-4">
        <Button
          fullWidth
          variant="contained"
          disabled={isOutOfStock}
          onClick={() => handleAddToCart(product?._id, product?.totalStock)}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#1f2937",
            },
          }}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
