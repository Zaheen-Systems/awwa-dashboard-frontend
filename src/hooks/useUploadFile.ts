import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export function useUploadStudentsCSV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/api/students/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries({ queryKey: ["allstudents"] });
      return data;
    },
  });
}

export function useUploadUsersCSV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/api/users/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return data;
    },
  });
}
