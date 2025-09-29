interface UserName {
  first_name: string;
}

interface IndividualIEPGoal {
  id: number;
  student_id: string; // UUID as string
  description?: string | null;
  goal_met?: string | null;     // will become boolean later
  processed?: string | null;    // will become boolean later
  gco_number?: string | null;    // will become boolean later
}

export interface Student {
  id: string; // UUID
  name: string;
  chronological_age: number;
  age_band?: string | null;
  functional_age?: string | null;
  primary_diagnosis?: string | null;
  secondary_diagnosis?: string | null;
  entry_type: string;
  ct?: UserName | null;
  last_gco_date?: string | null; // ISO date string
  gco_1_functional_age?: string | null;
  gco_2_functional_age?: string | null;
  gco_3_functional_age?: string | null;
  created_at: string; // ISO datetime string
  iep_goals: IndividualIEPGoal[];
  class_name?: string;
  gco_theme?: string;
}

export interface StudentUpdate {
  id: string; // UUID
  name: string;
  chronological_age: number;
  age_band?: string | null;
  functional_age?: string | null;
  primary_diagnosis?: string | null;
  secondary_diagnosis?: string | null;
  entry_type: string;
  ct?: UserName | null;
  last_gco_date?: string | null; // ISO date string
  gco_1_functional_age?: string | null;
  gco_2_functional_age?: string | null;
  gco_3_functional_age?: string | null;
  created_at: string; // ISO datetime string
  iep_goals: string[];
  class_name?: string;
  gco_theme?: string;
}