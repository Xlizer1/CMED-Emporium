"use client";

import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ThemeInitializer from "@/ThemeInitializer";

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  const theme = createTheme({
    palette: {
      mode: mode as "light" | "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeInitializer /> {/* Add this line */}
      <Box sx={{ display: "flex" }}>
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${240}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppContent>{children}</AppContent>
    </Provider>
  );
}
