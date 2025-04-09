import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

interface User {
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
}

export const userService = {
  saveUser: async (user: User) => {
    try {
      const response = await axios({
        url: `${API_URL}/users/checkUserExist`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...user,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
