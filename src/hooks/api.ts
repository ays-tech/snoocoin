import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetPoints(id: 99281932) {
  return useQuery({
    queryKey: ["points"],
    queryFn: async () => {
      const res = await axios.get(
        `https://bibi-backend-s3nm.onrender.com/users/points/${id}/`
      );
      return res.data?.points;
    },
    enabled: !!id,
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

export function useStorePoints() {
  return useMutation({
    mutationFn: async ({ id, point }: { id: number; point: number }) => {
      const res = await axios.post(
        `https://bibi-backend-s3nm.onrender.com/users/points/${id}/`,
        { points: point }
      );
      return res.data;
    },
  });
}
