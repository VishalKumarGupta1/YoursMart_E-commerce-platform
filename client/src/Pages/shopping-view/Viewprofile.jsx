import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { changePassword } from "../../store/auth-slice/index";

const Viewprofile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setOldPassword("");
    setNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
  };

  const handleSavePassword = async () => {
    dispatch(changePassword({ oldPassword, newPassword })).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
        handleClose();
      } else {
        toast.error(res?.payload?.message);
        handleClose();
      }
    });
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      {/* Profile Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        }}
      >
        <Stack alignItems="center" spacing={1.5}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "primary.main",
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>

          <Typography variant="h6">{user?.name || "User Name"}</Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <CardContent sx={{ px: 0 }}>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {user?.phone}
            </Typography>
          </Stack>
        </CardContent>

        <Button
          fullWidth
          variant="contained"
          startIcon={<LockResetIcon />}
          sx={{ mt: 2 }}
          onClick={handleOpen}
        >
          Change Password
        </Button>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Change Password</DialogTitle>

        <DialogContent>
          {/* Old Password */}
          <TextField
            fullWidth
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password */}
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePassword}
            disabled={!oldPassword || !newPassword || isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Viewprofile;
