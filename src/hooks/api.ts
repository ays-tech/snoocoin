import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetPoints(id: number) {
  return useQuery({
    queryKey: ["points"],
    queryFn: async () => {
      const res = await axios.get(`/users/points/${id}/`);
      return res.data?.points;
    },
    enabled: !!id,
  });
}

export function useFetchReferrals(id: number) {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const res = await axios.get(`/users/referrals/${id}/`);
      return res.data?.referred_users;
    },
  });
}

export function useStorePoints() {
  return useMutation({
    mutationFn: async ({ id, point }: { id: number; point: number }) => {
      const res = await axios.post(`/users/points/${id}/`, { points: point });
      return res.data;
    },
  });
}

export function useStoreWallet() {
  return useMutation({
    mutationFn: async ({ id, address }: { id: number; address: string }) => {
      const res = await axios.post(`/users/walletaddress/${id}/`, {
        wallet_address: address,
      });
      return res.data;
    },
  });
}
