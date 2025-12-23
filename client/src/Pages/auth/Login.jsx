import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-slice";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
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
    dispatch(loginUser(formData)).then((data) => {
      console.log("login submit", data.payload);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
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

        {/* Forgot Password */}
        <Box sx={{ textAlign: "right", mt: 1 }}>
          <Link href="#" underline="hover">
            Forgot password?
          </Link>
        </Box>

        {/* Submit Button */}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Login
        </Button>

        {/* Create Account */}
        <Typography align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Link component={RouterLink} to="/auth/register" underline="hover">
            Create new account
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
