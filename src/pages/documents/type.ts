export interface Document {
  dependentName: string;
  dependentRelation: string;
  employeePhoneNumber: string;
  ssnLast4: string;
  dateOfSubmission: string;
  documentValidity: string;
  documentFieldsStatus: string;
}

export interface CardType {
  title: string;
  value: string;
  total?: string;
  icon: React.ReactNode;
  status: "green" | "yellow" | "orange" | "red";
  desc?: string;
}
