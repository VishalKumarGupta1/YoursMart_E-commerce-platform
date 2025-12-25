import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const ProductCard = ({ product, handleGetProductDeatil, handleAddToCart }) => {
  return (
    <div className="cursor-pointer">
      <Card sx={{ maxWidth: 345 }}>
        <div onClick={() => handleGetProductDeatil(product?._id)}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={product.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.title}
            </Typography>
            <Typography>
              {product.salePrice} {product.price}
            </Typography>
            <Typography>
              {product.brand} {product.category}
            </Typography>
            <Typography>
              {product.totalStock === 0 && "Out of Stock"}{" "}
              {product.totalStock < 10 &&
                product.totalStock > 0 &&
                `${product.totalStock} item left`}
            </Typography>
          </CardContent>
        </div>
        <CardActions>
          <Button
            size="small"
            onClick={() => handleAddToCart(product?._id,product?.totalStock)}
            disabled={product.totalStock === 0}
          >
            Add to cart
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ProductCard;
