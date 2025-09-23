import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { StudentBaseRead } from "../types/class";

async function fetchStudents(): Promise<StudentBaseRead[]> {
  const res = await api.get("/api/students/?use_base_read=true"); // 👈 your FastAPI endpoint
  return res.data;
}

export const useStudents = () => {
  return useQuery<StudentBaseRead[]>({
    queryKey: ["allstudents"], 
    queryFn: fetchStudents,
  });
};

// ---------------- Create Student ----------------
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStudent: any) => {
      const res = await api.post("/api/students/", newStudent);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allstudents"] });
    },
  });
}

// ---------------- Update Student ----------------
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await api.put(`/api/students/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allstudents"] });
    },
  });
}

// ---------------- Delete Student ----------------
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/students/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allstudents"] });
    },
  });
}