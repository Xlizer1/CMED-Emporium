import { userService } from "@/services/userService";
import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  callback: handleCallback({
    afterCallback: async (req: any, session: { user: any }, state: any) => {
      const user = session.user;

      await userService.saveUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        nickname: user.nickname,
        email_verified: user.email_verified,
        updated_at: user.updated_at,
      });
      return session;
    },
  }),
});

export const POST = handleAuth();
