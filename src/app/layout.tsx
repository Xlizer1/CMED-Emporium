import * as React from "react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Providers from "./Provider";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <title>CMED Emporium</title>
      </head>
      <UserProvider>
        <body>
          <InitColorSchemeScript attribute="class" />
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <Providers>{props.children}</Providers>
          </AppRouterCacheProvider>
        </body>
      </UserProvider>
    </html>
  );
}
