"use client";

import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box,
    Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import { useRouter } from "next/navigation";
import logo from "@/assets/images/Logo.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const drawerWidth = 240;

export default function Sidebar() {
    const router = useRouter();
    const mode = useSelector((state: RootState) => state.theme.mode);

    const menuItems = [
        { text: "Home", icon: <HomeIcon />, path: "/" },
        { text: "Profile", icon: <PersonIcon />, path: "/profile" },
        { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                backgroundColor: "background.paper",
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Box sx={{ overflow: "auto" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "60px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            gap: 2,
                        }}
                    >
                        <Image
                            src={logo}
                            width={40}
                            height={40}
                            alt="Picture of the author"
                        />
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>
                                Integrated Solutions
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "#737373" }}>
                                Ticket System
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <List sx={{ marginTop: 3}} dense disablePadding>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding disableGutters>
                            <ListItemButton
                                onClick={() => router.push(item.path)}
                                disableGutters
                                disableRipple
                                sx={{
                                    margin: 2,
                                    marginY: 0,
                                    padding: 1,
                                    paddingY: 1,
                                    borderRadius: 2,
                                }}
                            >
                                {/* <ListItemIcon
                                    sx={{
                                        color:
                                            mode === "dark" ? "white" : "black",
                                        margin: 0,
                                        padding: 0,
                                    }}
                                > */}
                                    {item.icon}
                                {/* </ListItemIcon> */}
                                <ListItemText
                                    sx={{
                                        marginLeft: 1,
                                        padding: 0,
                                    }}
                                    primary={item.text}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
