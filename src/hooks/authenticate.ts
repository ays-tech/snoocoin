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
    wallet_address,
    referrer_uid: referrer_uid || 0, // Ensure it's a number
  };

  try {
    const registerUserRes: AxiosResponse<any> = await axios.post(
      "/users/register/",
      body,
      { headers }
    );

    console.log("User registered successfully:", registerUserRes.data);
    return registerUserRes.data;
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};
