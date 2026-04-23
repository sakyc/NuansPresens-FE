# QR Scanner Integration Guide

## Overview
QR Scanner sekarang terintegrasi dengan API backend Anda di `http://localhost:2000/api/presensi`. Scanner akan menangkap QR code dan mengirimkan data ke API untuk disimpan ke database.

## Fitur Utama

### 1. **QR Code Scanning**
- Menggunakan library `html5-qrcode` untuk capture kamera
- Support check-in dan check-out mode
- Automatic submission setelah QR di-scan

### 2. **Loading State**
- Menampilkan spinner loading saat proses API call
- User tahu sistem sedang memproses data mereka

### 3. **Success State**
- Menampilkan checkmark dengan pesan sukses dari API
- Auto reset setelah 3 detik

### 4. **Error Handling**
- Menampilkan error message dari API
- Tombol "Coba Lagi" untuk re-scan
- Handle network errors dan validasi errors

## Implementation Details

### Component: `scan-tab.tsx`

**Props & State:**
```typescript
- scanMode: "checkin" | "checkout" - mode scan yang aktif
- isScanning: boolean - apakah kamera sedang aktif
- scannedData: string | null - data QR yang ter-scan
- submissionStatus: "idle" | "loading" | "success" | "error"
- submissionMessage: string - pesan untuk ditampilkan ke user
- employeeData: EmployeeData | null - data karyawan dari localStorage
```

**Flow:**
1. User tap "Buka Kamera"
2. Kamera dimulai dan menampilkan viewfinder
3. QR di-scan → `decodedText` diterima
4. Kamera berhenti otomatis
5. Data QR dikirim ke API dengan employee data
6. Loading state ditampilkan
7. Response dari API menentukan success/error state

### Employee Data Storage: `lib/employee-storage.ts`

Functions tersedia:
- `getEmployeeData()` - Ambil data karyawan dari localStorage
- `saveEmployeeData(data)` - Simpan data karyawan
- `updateEmployeeData(data)` - Update parsial data karyawan
- `clearEmployeeData()` - Hapus data karyawan

**Data Structure:**
```typescript
interface EmployeeData {
  id_karyawan: string;      // ID karyawan (required)
  karyawan_shift: string;   // ID shift karyawan (required)
  nama?: string;            // Nama lengkap karyawan
  email?: string;           // Email karyawan
}
```

## Integration Steps

### 1. **Set Employee Data After Login**

Setelah user login berhasil, simpan data employee:

```typescript
import { saveEmployeeData } from "@/lib/employee-storage";

// Dalam login handler Anda:
const loginResponse = await fetch("/api/login", {
  method: "POST",
  body: JSON.stringify({ email, password })
});

const user = await loginResponse.json();

// Simpan employee data
saveEmployeeData({
  id_karyawan: user.id,
  karyawan_shift: user.shift_id,
  nama: user.nama,
  email: user.email
});

// Redirect ke employee app
window.location.href = "/employee";
```

### 2. **Update Backend Integration URL**

Jika backend URL berbeda, update di `scan-tab.tsx`:

```typescript
const API_URL = "http://localhost:2000/api/presensi";
// atau
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api/presensi";

// Di dalam submitPresensi:
const response = await fetch(API_URL, {
  method: "POST",
  // ...
});
```

### 3. **Handle Different Shift IDs**

Jika `curent_shift` perlu dinamis berdasarkan waktu saat ini:

```typescript
const getCurrentShiftId = () => {
  const hour = new Date().getHours();
  
  if (hour >= 8 && hour < 12) return "1"; // Pagi
  if (hour >= 13 && hour < 17) return "2"; // Siang
  if (hour >= 18 && hour < 22) return "3"; // Malam
  
  return employeeData?.karyawan_shift || "1";
};

// Dalam submitPresensi:
body: JSON.stringify({
  id_karyawan: employeeData.id_karyawan,
  karyawan_shift: employeeData.karyawan_shift,
  curent_shift: getCurrentShiftId(), // Dynamic shift
  token: token,
}),
```

### 4. **Display Employee Name**

Update tampilan scanner untuk menampilkan nama employee yang sedang scan:

```typescript
// Di awal ScanTab component, setelah employeeData loaded:
{employeeData && (
  <div className="mb-4 p-3 bg-card rounded-lg border border-border/50">
    <p className="text-xs text-muted-foreground">Scanning sebagai:</p>
    <p className="text-sm font-semibold text-foreground">{employeeData.nama}</p>
  </div>
)}
```

## API Expectations

Backend API (`http://localhost:2000/api/presensi`) harus:

### Request:
```json
{
  "id_karyawan": "1",
  "karyawan_shift": "1",
  "curent_shift": "1",
  "token": "QR_CODE_VALUE"
}
```

### Success Response (200):
```json
{
  "status": "success",
  "code": 200,
  "message": "Presensi berhasil",
  "data": {
    "id": 123,
    "karyawan_id": 1,
    "shift_id": 1,
    "tanggal": "2024-01-15",
    "jam_masuk": "08:02:30"
  }
}
```

### Error Response (400/500):
```json
{
  "status": "error",
  "code": 400,
  "message": "Token tidak sesuai" | "Shift tidak sesuai" | "Error message"
}
```

## Testing

### 1. **Mock Employee Data**
```typescript
import { saveEmployeeData } from "@/lib/employee-storage";

// Buka browser console dan run:
saveEmployeeData({
  id_karyawan: "1",
  karyawan_shift: "1",
  nama: "Test User",
  email: "test@example.com"
});
```

### 2. **Generate QR Code untuk Testing**
Buka https://www.qr-code-generator.com/ dan buat QR code dengan nilai yang sesuai dengan token di database Anda.

### 3. **Monitor Network Requests**
- Buka DevTools → Network tab
- Scan QR code
- Lihat request ke `/api/presensi`
- Check request/response body

## Troubleshooting

### ❌ "Data karyawan tidak ditemukan"
- **Cause**: localStorage kosong atau belum di-set
- **Fix**: Pastikan login berhasil dan `saveEmployeeData` di-call
- **Debug**: Check localStorage di DevTools → Application → Local Storage

### ❌ "Terjadi kesalahan saat menghubungi server"
- **Cause**: Network error atau CORS issue
- **Fix**: 
  - Pastikan backend server running di `http://localhost:2000`
  - Check backend logs untuk errors
  - Verifikasi CORS settings di backend

### ❌ "Token tidak sesuai"
- **Cause**: QR token tidak match dengan database
- **Fix**: 
  - Verify QR code value sesuai dengan token di database
  - Check database untuk QR codes yang tersedia
  - Ensure QR generation menggunakan token yang tepat

### ❌ "Shift tidak sesuai"
- **Cause**: `curent_shift` tidak match dengan `karyawan_shift`
- **Fix**:
  - Verify shift ID di employee data
  - Check database shift settings
  - Update logic untuk dynamic shift selection

## Environment Variables

Tambahkan ke `.env.local` (opsional):

```
NEXT_PUBLIC_API_URL=http://localhost:2000
NEXT_PUBLIC_API_TIMEOUT=30000
```

Kemudian gunakan:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";
const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000");
```

## Future Enhancements

1. **Add signature capture** - untuk verifikasi identity
2. **Facial recognition** - alternative QR scanning
3. **Offline mode** - queue submissions saat offline
4. **Analytics dashboard** - track scanning patterns
5. **Multi-location support** - different APIs per location
