import { EmployeeApp } from "@/components/employee/employee-app";
import { useSession } from "next-auth/react";

export default function EmployeePage() {
  const {data: session} = useSession();
  console.log(session);
  
  return <EmployeeApp />;
}
