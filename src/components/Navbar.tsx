"use client";

import { RootState } from "@/store/store";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { toggleTheme } from "@/store/Slices/themeSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const mode = useSelector((state: RootState) => state.theme.mode);
    const pathname = usePathname();

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

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: "background.paper", // This will use the theme's background color
                color: "text.primary", // This will use the theme's text color
                borderBottom: mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.12)'
                    : '1px solid rgba(0, 0, 0, 0.12)',
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
                <IconButton color="inherit" onClick={handleThemeToggle}>
                    {mode === "dark" ? (
                        <Brightness7Icon />
                    ) : (
                        <Brightness4Icon />
                    )}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
