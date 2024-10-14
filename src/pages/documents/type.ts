 

interface Documents {
  autoInsurance?: Document[];
  utilityBill?: Document[];
  marriageCertificate?: Document[];
}

export interface Document {
  last_name: string;
  reconciliation_id: string;
  coverage_level: string;
  start_date: string;
  dob: string;
  first_name: string;
  phone_number: string;
  benefit: string;
  employee_ssn: string;
  serial: string;
  relationship: string;
  ssn: string;
  dependent_type: string;
  date_of_creation: string;
  dependent_last_name: string;
  dependent_first_name: string;
  documents: Documents;
  aggregated_doc_status: string;
}

export interface CardType {
  title: string;
  value: string;
  total?: string;
  icon: React.ReactNode;
  status: "green" | "yellow" | "orange" | "red";
  desc?: string;
}
