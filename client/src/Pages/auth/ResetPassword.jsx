import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../store/auth-slice";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(resetPassword({ token, newPassword: formData.password })).then(
      (data) => {
        if (data?.payload?.success) {
          toast.success(data?.payload?.message);
          navigate("/auth/login");
        } else {
          toast.error(data?.payload?.message);
        }
      }
    );
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Reset Password
      </Typography>

      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Enter your new password below
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {/* New Password */}
        <TextField
          fullWidth
          label="New Password"
          name="password"
          type={showPassword ? "text" : "password"}
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

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          margin="normal"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Box sx={{ textAlign: "right", mt: 1, color:"blue" }}>
            <Link
              component="button"
              underline="hover"
              to="/auth/login"
            >
              Login
            </Link>
          </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Reset Password
        </Button>
      </Box>
    </Paper>
  );
};

export default ResetPassword;
