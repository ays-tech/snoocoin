import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetPoints(id: number) {
  return useQuery({
    queryKey: ["points"],
    queryFn: async () => {
      const res = await axios.get(
        `https://bibi-backend-s3nm.onrender.com/users/points/${id}/`
      );
      return res.data?.points;
    },
  });
}

export function useFetchReferrals(id: number) {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const res = await axios.get(
        `https://bibi-backend-s3nm.onrender.com/users/referrals/${id}/`
      );
      return res.data?.referred_users;
    },
  });
}
