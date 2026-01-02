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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, loginUser } from "../../store/auth-slice";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const { isLoading } = useSelector((state) => state.auth);

  // Forgot password states
  const [openForgot, setOpenForgot] = React.useState(false);
  const [forgotEmail, setForgotEmail] = React.useState("");

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
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  // Forgot password submit
  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    dispatch(forgetPassword({ email: forgotEmail })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });

    setOpenForgot(false);
    setForgotEmail("");
  };

  return (
    <>
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
            <Link
              component="button"
              underline="hover"
              onClick={() => setOpenForgot(true)}
            >
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

      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgot}
        onClose={() => {
          setForgotEmail("");
          setOpenForgot(false);
        }}
      >
        <DialogTitle>Forgot Password</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="normal"
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForgot(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleForgotPassword}>
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
