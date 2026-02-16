// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    username?: string;
    email?: string | null;
    karyawan?: {
      id: number;
      nama: string;
      nip?: string;
      jabatan?: string;
    };
  }

  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      karyawan?: {
        id: number;
        nama: string;
        nip?: string;
        jabatan?: string;
        email?: string | null;
      };
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    username?: string;
    email?: string | null;
    karyawan?: {
      id: number;
      nama: string;
      nip?: string;
      jabatan?: string;
      email?: string | null;
    };
  }
}