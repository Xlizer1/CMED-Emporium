"use client";

import { RootState } from "@/store/store";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { toggleTheme } from "@/store/Slices/themeSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { handleLogout } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { red } from "@mui/material/colors";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useUser();
  const pathname = usePathname();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleThemeToggle = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newMode);
    dispatch(toggleTheme());
  };

  const formatPathname = (path: string) => {
    const trimmedPath = path.slice(1);
    if (trimmedPath === "") return "Home";
    return trimmedPath
      .split("/")
      .map(
        (segment) =>
          segment.charAt(0).toUpperCase() +
          segment.slice(1).replace(/[-_]/g, " ")
      )
      .join(" / ");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper", // This will use the theme's background color
        color: "text.primary", // This will use the theme's text color
        borderBottom:
          mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 0, mr: 2 }}></Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, marginLeft: "240px" }}
        >
          {formatPathname(pathname)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton color="inherit" onClick={handleThemeToggle}>
            {mode === "dark" ? (
              <Brightness7Icon fontSize="medium" />
            ) : (
              <Brightness4Icon fontSize="medium" />
            )}
          </IconButton>
          <IconButton
            color="inherit"
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {user?.picture ? (
              <Image
                src={user?.picture}
                width={40}
                height={40}
                alt="#"
                style={{
                  borderRadius: "50%",
                }}
              />
            ) : (
              <FaRegUser />
            )}

            {/* <a href="/api/auth/logout">Logout</a> */}
          </IconButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem>
              {/* <Link
                href="/api/auth/logout"
                style={{ textDecoration: "none", color: red[500] }}
              >
                SignOut
              </Link> */}
              <a href="/api/auth/logout">Logout</a>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
