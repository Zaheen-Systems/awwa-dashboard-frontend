import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { TeamMember } from "../types/users";

// Fetch function
const fetchUsers = async (): Promise<TeamMember[]> => {
  const { data } = await api.get("/api/users/");
  return data;
};

// React Query hook
export const useUsers = () => {
  return useQuery<TeamMember[]>({
    queryKey: ["users"], 
    queryFn: fetchUsers,
  });
};

// ---------------- Create User ----------------
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: any) => {
      const res = await api.post("/api/users/", newUser);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// ---------------- Update User ----------------
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`/api/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
