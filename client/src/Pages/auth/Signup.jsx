import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOtp } from "../../store/auth-slice";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openOtpDialog, setopenOtpDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [otp, setOtp] = React.useState("");
  const [otpEmail, setotpEmail] = useState();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleCloseOtpDialog = () => {
    setopenOtpDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setotpEmail(formData.email);
        setopenOtpDialog(true);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  const handleVerifyOtp = (e) => {
    dispatch(verifyOtp({ email: otpEmail, otp })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setopenOtpDialog(false);
        navigate("/auth/login");
        setotpEmail(null);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
    <>
      <Paper elevation={3} sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Name */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Phone Number */}
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            name="phone"
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Register Button */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Register
          </Button>

          {/* Login Link */}
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/auth/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>

      <div>
        <Dialog
          open={openOtpDialog}
          onClose={handleCloseOtpDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogContent>
            <Typography>OTP sent to your {otpEmail} </Typography>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <MuiOtpInput
                value={otp}
                onChange={handleOtpChange}
                length={6}
                inputType="number"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleCloseOtpDialog} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOtp}
              variant="contained"
              disabled={otp.length < 6}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
