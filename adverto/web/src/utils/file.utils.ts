export function getFileExtension(file: File) {
  return file.type.split('/')[1];
}
