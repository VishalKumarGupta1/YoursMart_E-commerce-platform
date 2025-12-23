import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import CartItemContent from "./CartItemContent";

const CartDrawer = ({ cartItems, open, toggleDrawer }) => {
  // Calculate subtotal
  const subtotal =
    cartItems?.items?.reduce(
      (total, item) => total + item.salePrice * item.quantity,
      0
    ) || 0;

  const shipping = 99; // dummy price
  const total = subtotal + shipping;

  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 400,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {cartItems?.items?.length > 0 ? (
            cartItems.items.map((item) => (
              <CartItemContent key={item.productId} item={item} />
            ))
          ) : (
            <Typography>Your cart is empty</Typography>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal</Typography>
            <Typography>₹{subtotal}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Shipping</Typography>
            <Typography>₹{shipping}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">₹{total}</Typography>
          </Box>

          <Button variant="contained" color="primary" fullWidth size="large">
            Checkout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
