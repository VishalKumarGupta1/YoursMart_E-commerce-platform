import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItems,
  updateCartQuantity,
} from "../../store/shop/cart-slice";

const CartItemContent = ({ item }) => {
  const totalPrice = item.salePrice * item.quantity;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDeleteCartItem = (id) => {
    dispatch(deleteCartItems({ userId: user._id, productId: id })).then(
      (res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
        } else {
          toast.error(res?.payload?.message);
        }
      }
    );
  };

  const handleUpdateQuantity = (item, type) => {
    dispatch(
      updateCartQuantity({
        userId: user?._id,
        productId: item?.productId,
        quantity: type === "plus" ? item?.quantity + 1 : item?.quantity - 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  return (
    <Box
      display="flex"
      gap={2}
      borderBottom="1px solid #e0e0e0"
      paddingY={2}
      alignItems="center"
    >
      {/* Product Image */}
      <img
        src={item.image}
        alt={item.title}
        style={{
          width: 80,
          height: 80,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />

      {/* Product Details */}
      <Box flex={1}>
        <Typography variant="subtitle1" fontWeight="bold">
          {item.title}
        </Typography>

        <div className="flex  gap-4">
          <Typography variant="body2" color="text.secondary">
            ₹{item.salePrice}
          </Typography>

          <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", color: "gray" }}
          >
            {" "}
            ₹{item.price}{" "}
          </Typography>
        </div>
        {/* Quantity Controls */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <IconButton
            size="small"
            onClick={() => handleUpdateQuantity(item, "minus")}
            disabled={item.quantity === 1}
          >
            <RemoveIcon />
          </IconButton>

          <Typography>{item.quantity}</Typography>

          <IconButton
            size="small"
            onClick={() => handleUpdateQuantity(item, "plus")}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Total Price */}
        <Typography mt={1} fontWeight="bold">
          Total: ₹{totalPrice}
        </Typography>
      </Box>

      {/* Delete Button */}
      <IconButton
        color="error"
        onClick={() => handleDeleteCartItem(item.productId)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CartItemContent;
