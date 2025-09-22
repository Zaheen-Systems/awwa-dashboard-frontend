export interface UserWithClasses {
  id?: number;
  first_name: string;
  last_name?: string;
  age?: number;
  gender?: string;
  email: string;
  phone_number: string;
  job_title: string;
  department: string;
  bio: string;
  role: string;
  classes: string; // comma separated classes
  specialization?: string;
  date_of_joining?: string;
  photo?: string;
}

export interface TeamMember {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  id_number?: string;
  specialization: string;
  classes: string;
  role: string;
  email?: string;
  dob?: string;
  date_of_joining?: string;
  photo?: string;
}