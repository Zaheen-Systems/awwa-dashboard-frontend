// types.ts
export interface ClassData {
  id: number;
  name: string;
  days: string;
  class_timing: string;
  number_of_students: number;
  number_of_team_members: number;
  number_of_cts: number;
}

export interface StudentBaseRead {
  id: number;
  name: string;
  email?: string;
  chronological_age: number;
  id_number?: string;
  age_band?: string;
  gender?: string ;
  primary_diagnosis?: string;
  secondary_diagnosis?: string;
  entry_type?: string;
  dob?: string;
  date_of_enrollment?: string;
  ct?: string;
  photo?: string;
  guardian_name?: string;
  guardian_contact?: string;
}

export interface UserRead {
  id: number;
  first_name: string;
  last_name?: string | null;
  gender?: string | null;
  id_number?: string | null;
  job_title?: string | null;
  department?: string | null;
  bio?: string | null;
  role?: string | null;
  specialization?: string | null;
  created_at?: string | null;
  date_of_joining: string;
  photo?: string;
}

export interface ClassDetail {
  students: StudentBaseRead[];
  users: UserRead[];
}
