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

const uploadStudentPhoto = async (studentId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/api/students/${studentId}/upload-photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const useUploadStudentPhoto = () => {
  return useMutation({
    mutationFn: ({ studentId, file }: { studentId: number; file: File }) =>
      uploadStudentPhoto(studentId, file),
  });
};

const uploadUserPhoto = async (userId: number, file: File) => {
  if (userId != 0) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post(`/api/users/${userId}/upload-photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }
};

export const useUploadUserPhoto = () => {
  return useMutation({
    mutationFn: ({ userId, file }: { userId: number; file: File }) =>
      uploadUserPhoto(userId, file),
  });
};
