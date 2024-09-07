import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { ImageFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<ImageFileRouter>();
export const UploadDropzone = generateUploadDropzone<ImageFileRouter>();

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<ImageFileRouter>();
