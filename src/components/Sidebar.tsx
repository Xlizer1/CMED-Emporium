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
import logo1 from "@/assets/images/Logo1.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { GoHome } from "react-icons/go";

const drawerWidth = 240;

export default function Sidebar() {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const menuItems = [
    { text: "Home", icon: <GoHome style={{ fontSize: 26 }} />, path: "/" },
    { text: "Files", icon: <FolderCopyIcon />, path: "/files" },
    // { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
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
              width: "100%",
              gap: 2,
              marginTop: 6,
            }}
          >
            <Image
              src={mode === "dark" ? logo1 : logo}
              width={100}
              height={100}
              alt="Picture of the author"
            />
            {/* <Box>
                            <Typography sx={{ fontWeight: "bold" }}>
                                CMED
                            </Typography>
                            <Typography sx={{ fontSize: 10, color: "#737373" }}>
                                Emporium
                            </Typography>
                        </Box> */}
          </Box>
        </Box>
        <List sx={{ marginTop: 4 }} dense disablePadding>
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
                {item.icon}
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
