import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

const ProductCard = ({
  product,
  setcurrentEditedId,
  setOpen,
  setFormData,
  handleDeleteProduct,
}) => {
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = product;

  return (
    <Card sx={{ maxWidth: 300 }}>
      {/* Product Image */}
      <CardMedia
        component="img"
        image={image || "/placeholder.png"}
        alt={title}
        sx={{
          height: 160,
          objectFit: "cover", // fills area without distortion
        }}
      />

      <CardContent>
        {/* Title */}
        <Typography gutterBottom variant="h6" mt={-2}>
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
          noWrap
        >
          {description}
        </Typography>

        {/* Brand & Category */}
        <Typography variant="body2" color="text.secondary">
          {brand} • {category}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* Price */}
          {salePrice ? (
            <>
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                ₹{price}
              </Typography>

              <Typography variant="h6" color="primary">
                ₹{salePrice}
              </Typography>
            </>
          ) : (
            <Typography variant="h6">₹{price}</Typography>
          )}

          {/* Stock */}
          <Typography
            variant="caption"
            sx={{
              ml: "auto",
              color: totalStock > 0 ? "success.main" : "error.main",
              fontWeight: 500,
            }}
          >
            {totalStock > 0 ? `In Stock (${totalStock})` : "Out of Stock"}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ mt: "-15px" }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setcurrentEditedId(product?._id);
            setOpen(true);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => handleDeleteProduct(product?._id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
