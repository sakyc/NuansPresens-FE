// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    username?: string;
    karyawan?: {
      id: number;
      email?: string | null;
      nama: string;
      nip?: string;
      jabatan?: {
          id: number;
          nama_jabatan: string;
        }
    };
  }

  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string | null;
      role?: string;
      karyawan?: {
        id: number;
        nama: string;
        nip?: string;
        email?: string | null;
        no_hp?: string;
        alamat?: string;
        jabatan?: {
          id: number;
          nama_jabatan: string;
        }
        divisi?: {
          id: number;
          nama_divisi: string;
        }
        shift?: {
        id: number;
        nama_shift: string;
        jam_mulai: string;
        jam_selesai: string;
      }
      };
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    username?: string;
    karyawan?: {
      id: number;
      nama: string;
      nip?: string;
      email?: string | null;
      jabatan?: {
          id: number;
          nama_jabatan: string;
      }
      shift?: {
        id: number;
        nama_shift: string;
        waktu_mulai: string;
        waktu_selesai: string;
      }
    };
  }
}