import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Rating,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProductDetailDialog = ({ open, onClose, product, onAddToCart }) => {
  return (
    <div>
      {/* onclick  product dialog open */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Product</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f5f5f5" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            {/* LEFT COLUMN — IMAGE */}
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <img
                src={product?.image}
                alt={product?.title}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* RIGHT COLUMN — DETAILS */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {/* Title */}
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#111" }}>
                {product?.title}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating value={4} readOnly size="small" />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  (124 reviews)
                </Typography>
              </Box>

              {/* Description */}
              <Typography variant="body2" sx={{ color: "#555" }}>
                {product?.description}
              </Typography>

              {/* Category & Brand */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: "#e0e0e0",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {product?.category}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: "#e0e0e0",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {product?.brand}
                </Typography>
              </Box>

              {/* Price */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ₹{product?.salePrice}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "#888" }}
                >
                  ₹{product?.price}
                </Typography>
              </Box>

              {/* Stock */}
              <Typography
                variant="body2"
                sx={{
                  color: product?.totalStock > 0 ? "#2e7d32" : "#c62828",
                  fontWeight: 500,
                }}
              >
                {product?.totalStock > 0
                  ? `In Stock (${product?.totalStock})`
                  : "Out of Stock"}
              </Typography>
            </Box>
          </Box>

          {/* REVIEWS SECTION */}
          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Reviews
          </Typography>

          {/* Dummy Review */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#000" }}>
              <PersonIcon />
            </Avatar>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                John Doe
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                Great quality product, totally worth the price!
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        {/* ACTIONS */}
        <DialogActions sx={{ px: 0, pt: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              "&:hover": { backgroundColor: "#333" },
            }}
            disabled={product?.totalStock === 0}
            onClick={() => onAddToCart(product?._id, product?.totalStock)}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductDetailDialog;
