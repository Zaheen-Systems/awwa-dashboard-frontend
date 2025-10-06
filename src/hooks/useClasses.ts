// hooks/useClasses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { ClassData, ClassDetail } from "../types/class";

const fetchClasses = async (): Promise<ClassData[]> => {
  const { data } = await api.get<ClassData[]>("/api/classes/");
  return data;
};

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });
}

const fetchClassDetail = async (classId: number): Promise<ClassDetail> => {
  const { data } = await api.get(`/api/classes/${classId}`);
  return data;
};

export const useClassDetail = (classId: number) => {
  return useQuery({
    queryKey: ["classDetail", classId],
    queryFn: () => fetchClassDetail(classId),
    enabled: !!classId, // only run if classId is defined
  });
};

interface CreateClassData {
  className: string;
  days: string;
  classTimings: string;
}

const createClass = async (classData: CreateClassData): Promise<ClassData> => {
  const { data } = await api.post<ClassData>("/api/classes/", {
    name: classData.className,
    days: classData.days,
    class_timing: classData.classTimings,
    number_of_students: 0,
    number_of_team_members: 0,
    number_of_cts: 0
  });
  return data;
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      // Invalidate and refetch classes list
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: number) => {
      const response = await api.delete(`/api/classes/${classId}`);
      return response.data;
    },
    onSuccess: () => {
      // ✅ Optionally invalidate cached class list
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      console.log(`Class deleted successfully`);
    },
    onError: (error: any) => {
      console.error("Error deleting class:", error);
    },
  });
};
