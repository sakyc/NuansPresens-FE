import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton<any>({
  url: "https://jeramy-silty-stasia.ngrok-free.dev/api/upload-image",
});

export const UploadDropzone = generateUploadDropzone<any>({
  url: "https://jeramy-silty-stasia.ngrok-free.dev/api/upload-image",
});