// hooks/useClasses.ts
import { useQuery } from "@tanstack/react-query";
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
