"use client";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            paper: "#fefefe",
        },
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor:
                        theme.palette.mode === "dark" ? "#313131" : "#fefefe",
                    color:
                        theme.palette.mode === "dark" ? "#fefefe" : "#121212",
                }),
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? "#121212"
                            : "#fefefe",
                    color:
                        theme.palette.mode === "dark"
                            ? "#fefefe"
                            : "#121212",
                    borderBottom:
                        theme.palette.mode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.12)"
                            : "1px solid rgba(0, 0, 0, 0.12)",
                }),
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color:
                        theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.7)",
                }),
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&:hover": {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.08)"
                                : "rgba(0, 0, 0, 0.04)",
                    },
                }),
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    variants: [
                        {
                            props: { severity: "info" },
                            style: {
                                backgroundColor: "#60a5fa",
                            },
                        },
                    ],
                },
            },
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
});

export default theme;
