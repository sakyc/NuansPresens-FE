/**
 * Employee Data Storage Utility
 * Digunakan untuk menyimpan dan mengambil data karyawan dari localStorage
 * 
 * Format data yang disimpan:
 * {
 *   id_karyawan: "1",
 *   karyawan_shift: "1",
 *   nama: "Budi Andrianto",
 *   email: "budi@company.com"
 * }
 */

export interface EmployeeData {
  id_karyawan: string;
  karyawan_shift: string;
  nama?: string;
  email?: string;
}

const EMPLOYEE_STORAGE_KEY = "employee_data";

/**
 * Menyimpan data karyawan ke localStorage
 */
export function saveEmployeeData(data: EmployeeData): void {
  try {
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save employee data:", error);
  }
}

/**
 * Mengambil data karyawan dari localStorage
 */
export function getEmployeeData(): EmployeeData | null {
  try {
    const data = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get employee data:", error);
    return null;
  }
}

/**
 * Menghapus data karyawan dari localStorage
 */
export function clearEmployeeData(): void {
  try {
    localStorage.removeItem(EMPLOYEE_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear employee data:", error);
  }
}

/**
 * Update data karyawan parsial
 */
export function updateEmployeeData(data: Partial<EmployeeData>): void {
  const currentData = getEmployeeData();
  if (currentData) {
    saveEmployeeData({ ...currentData, ...data });
  }
}
