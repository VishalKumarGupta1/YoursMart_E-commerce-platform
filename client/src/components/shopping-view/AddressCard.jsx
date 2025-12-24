import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddressCard = ({ address, handleDeleteAddress, handleEditAddress }) => {
  return (
    <Card
      sx={{
        bgcolor: "white", // dark card background
        color: "black", // white text
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        position: "relative", // for positioning edit icon
      }}
    >
      {/* Edit & Delete Icons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <IconButton
          onClick={() => handleEditAddress(address)}
          sx={{ color: "grey.500" }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleDeleteAddress(address._id)}
          sx={{ color: "grey.500" }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {address.address}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2" color="grey.500">
            City: {address.city}
          </Typography>
          <Typography variant="body2" color="grey.500">
            Phone: {address.phone}
          </Typography>
          <Typography variant="body2" color="grey.500">
            Pincode: {address.pincode}
          </Typography>
          {address.notes && (
            <Typography variant="body2" color="grey.500">
              Notes: {address.notes}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
