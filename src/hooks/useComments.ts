import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export function useComments(descriptorId: number) {
  return useQuery({
    queryKey: ["comments", descriptorId],
    queryFn: async () => {
      const { data } = await api.get(`/api/comments/${descriptorId}/`);
      return data;
    },
  });
}

export function useAddComment(descriptorId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: { content: string; parent_id?: number }) => {
      const { data } = await api.post(
        `/api/comments/${descriptorId}`,
        newComment
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", descriptorId] });
    },
  });
}
