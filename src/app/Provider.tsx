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
import { useUser } from "@auth0/nextjs-auth0/client";

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) window.location.replace("http://localhost:8080/api/auth/login");
  if (error) return <div>{error.message}</div>;

  console.log(user);

  const theme = createTheme({
    palette: {
      mode: mode as "light" | "dark",
    },
  });

  return user ? (
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
  ) : !user && isLoading ? (
    <div>Loading...</div>
  ) : null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppContent>{children}</AppContent>
    </Provider>
  );
}
