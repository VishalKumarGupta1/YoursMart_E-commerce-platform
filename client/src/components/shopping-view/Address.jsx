import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddress,
  updateAddress,
} from "../../store/shop/address-slice";
import AddressCard from "./AddressCard";

const Address = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isLoading, addressList } = useSelector((state) => state.shopAddress);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  });
  const [currentEditedId, setcurrentEditedId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    dispatch(fetchAllAddress(user._id));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with a dispatch or API call

    if (addressList.length > 2 && currentEditedId === null) {
      toast.error("You can add max 3 address");
      setFormData({
        address: "",
        city: "",
        phone: "",
        pincode: "",
        notes: "",
      });
      return;
    }

    currentEditedId
      ? dispatch(
          updateAddress({
            userId: user._id,
            addressId: currentEditedId,
            formData,
          })
        ).then((res) => {
          if (res?.payload?.success) {
            dispatch(fetchAllAddress(user._id));
            toast.success(res?.payload?.message);
            setcurrentEditedId(null);
          } else {
            toast.error(res?.payload?.message);
          }
        })
      : dispatch(addNewAddress({ ...formData, userId: user._id })).then(
          (res) => {
            if (res?.payload?.success) {
              dispatch(fetchAllAddress(user._id));
              toast.success(res?.payload?.message);
            } else {
              toast.error(res?.payload?.message);
            }
          }
        );

    setFormData({
      address: "",
      city: "",
      phone: "",
      pincode: "",
      notes: "",
    });
  };

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress({ userId: user._id, addressId: id })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllAddress(user._id));
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleEditAddress = (addressInfo) => {
    setFormData({
      ...addressInfo,
      address: addressInfo.address,
      city: addressInfo.city,
      phone: addressInfo.phone,
      pincode: addressInfo.pincode,
      notes: addressInfo.notes,
    });
    setcurrentEditedId(addressInfo._id);
  };

  return (
    <>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-3  gap-3">
        {addressList?.map((item, index) => (
          <AddressCard
            key={index}
            address={item}
            handleDeleteAddress={handleDeleteAddress}
            handleEditAddress={handleEditAddress}
          />
        ))}
      </div>
      <Box sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
        <Typography variant="h5" mb={3}>
          {currentEditedId ? "Edit" : "Add"} Address
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <DialogActions sx={{ px: 0, mt: 2 }}>
            <Button
              type="submit"
              variant="outlined"
              sx={{ color: "black", border: " 1px solid black" }}
            >
              Save Address
            </Button>
          </DialogActions>
        </form>
        {/* loader  */}
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(216, 214, 214, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1301,
            }}
          >
            <img src="/loader.gif" height={50} width={50} alt="loading"></img>
          </div>
        )}
      </Box>
    </>
  );
};

export default Address;
