import { Storage } from "@google-cloud/storage";

const bucketName = 'job-camp-attachments';

const storage = new Storage();

export async function getFileUrl(fileName: string) {
  return await storage.bucket(bucketName).file(fileName).publicUrl;
}

export async function getFile(fileName: string) {
  return await storage.bucket(bucketName).file(fileName);
}

export async function addNewFile(fileName: string, fileToSave: any) {
  await storage.bucket(bucketName).file(fileName).save(fileToSave);
}

export async function deleteFile(fileName: string) {
  await storage.bucket(bucketName).file(fileName).delete({
    ifGenerationMatch: "generationMatchPrecondition",
  });
}