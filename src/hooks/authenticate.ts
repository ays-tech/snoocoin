import axios, { AxiosResponse } from "axios";

interface User {
  uid: number;
  first_name: string;
  last_name?: string | undefined;
  username?: string | undefined;
  is_premium?: boolean | undefined;
}

export const authenticateUser = async ({
  uid,
  first_name,
  last_name,
  username,
  is_premium,
}: User): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    first_name,
    last_name,
    uid,
    username,
    is_premium,
  };

  try {
    const res: AxiosResponse<any> = await axios.post(
      "https://bibi-backend-s3nm.onrender.com/api/users/register/",
      body,
      { headers }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
