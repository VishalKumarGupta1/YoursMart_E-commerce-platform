import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  TextField,
} from "@mui/material";

// 🔹 Dummy Data
const orderList = [
  {
    _id: "ORD12345",
    orderDate: "2024-01-12T10:30:00",
    orderStatus: "confirmed",
    totalAmount: 120,
  },
  {
    _id: "ORD67890",
    orderDate: "2024-02-05T14:20:00",
    orderStatus: "pending",
    totalAmount: 85,
  },
  {
    _id: "ORD11121",
    orderDate: "2024-03-01T09:10:00",
    orderStatus: "rejected",
    totalAmount: 220,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const AdminOrder = () => {
  const [orderStatus, setOrderStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus); // sync dropdown
    setOpen(true);
  };

  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = () => {
    if (!selectedOrder) return;

    const updatedData = {
      orderId: selectedOrder._id,
      status: orderStatus,
    };

    console.log("Updating Order Status:", updatedData);

    // 🔹 later you can dispatch API / redux action here
    // dispatch(updateOrderStatus(updatedData))

    // temporary UX feedback
    alert("Order status updated successfully!");
  };
  return (
    <Box p={3}>
      <Card>
        <CardHeader title=" All Order" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Order ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Order Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Price</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Details</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderList.length > 0 ? (
                  orderList.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.orderStatus}
                          color={getStatusColor(order.orderStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetails(order)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 🔹 Order Details Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              {/* 🔹 Order Details */}
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>

              <Typography>
                <b>Order ID:</b> {selectedOrder._id}
              </Typography>
              <Typography>
                <b>Status:</b> {selectedOrder.orderStatus}
              </Typography>
              <Typography>
                <b>Total:</b> ${selectedOrder.totalAmount}
              </Typography>
              <Typography mb={2}>
                <b>Date:</b> {selectedOrder.orderDate.split("T")[0]}
              </Typography>

              {/* 🔹 Products Section */}
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>

              <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    borderBottom: "1px solid #e0e0e0",
                    fontWeight: "bold",
                  }}
                >
                  <Typography>Product Name</Typography>
                  <Typography>Price</Typography>
                </Box>

                {/* Dummy Products */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                  }}
                >
                  <Typography>Wireless Headphones</Typography>
                  <Typography>$50</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                  }}
                >
                  <Typography>Smart Watch</Typography>
                  <Typography>$70</Typography>
                </Box>
              </Box>

              {/* 🔹 Shipping Info */}
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>

              <Typography>
                <b>Name:</b> John Doe
              </Typography>
              <Typography>
                <b>Address:</b> 221B Baker Street
              </Typography>
              <Typography>
                <b>City:</b> London
              </Typography>
              <Typography>
                <b>Pincode:</b> 123456
              </Typography>
              <Typography>
                <b>Phone:</b> +91 9876543210
              </Typography>
              <Typography>
                <b>Notes:</b> Please deliver in the evening
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" sx={{ color: "black", mb: 2 }}>
                  Update Order Status
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField
                    select
                    label="Order Status"
                    value={orderStatus}
                    onChange={handleStatusChange}
                    SelectProps={{ native: true }}
                    sx={{
                      flex: 1,
                      backgroundColor: "#fff",
                      borderRadius: 1,
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="rejected">Rejected</option>
                  </TextField>

                  <Button
                    variant="contained"
                    disabled={orderStatus === selectedOrder?.orderStatus}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#000",
                      px: 3,
                      "&:hover": { backgroundColor: "#fff" },
                    }}
                    onClick={handleUpdateOrderStatus}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminOrder;
