import axios, { AxiosResponse } from "axios";

interface User {
  uid: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_premium?: boolean;
  referrer_uid?: number;
  wallet_address?: string;
}

export const authenticateUser = async ({
  uid,
  first_name,
  last_name,
  username,
  is_premium,
  referrer_uid = 0, // Ensure this is a number
  wallet_address = "",
}: User): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    uid,
    first_name,
    last_name,
    username,
    is_premium,
    referrer_uid: referrer_uid || 0, // Ensure it's a number
    wallet_address,
  };

  try {
    const registerUserRes: AxiosResponse<any> = await axios.post(
      "https://bibi-backend-s3nm.onrender.com/users/register/",
      body,
      { headers }
    );

    console.log("User registered successfully:", registerUserRes.data);
    return registerUserRes.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        if (error.response.status === 400) return
      } else {
        console.error("Network or server error:", error.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
