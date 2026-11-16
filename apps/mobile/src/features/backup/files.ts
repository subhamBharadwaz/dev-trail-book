import { Directory, File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { maxBackupBytes } from "@trailbook/learning/backup";
export async function shareBackup(text: string, filename: string) {
  if (!(await Sharing.isAvailableAsync()))
    throw new Error("File sharing is not available on this device.");
  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  await file.write(text);
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: "Save your Dev Trailbook backup",
    UTI: "public.json",
  });
}
export async function pickBackup(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const file = new File(result.assets[0].uri);
  if ((result.assets[0].size ?? file.size) > maxBackupBytes)
    throw new Error("Choose a backup smaller than 8 MB.");
  return file.text();
}

export async function saveBackupOnDevice(text: string, filename: string) {
  const directory = await Directory.pickDirectoryAsync();
  const file = directory.createFile(filename, "application/json");
  await file.write(text);
  return filename;
}
