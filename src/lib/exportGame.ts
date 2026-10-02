export interface ExportResult {
  downloadUrl: string;
  fileSize: string;
  format: 'apk' | 'web-zip';
}

export async function exportGamePackage(gameName: string, format: 'apk' | 'web-zip'): Promise<ExportResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sanitizedName = gameName.toLowerCase().replace(/\s+/g, '-');
      resolve({
        downloadUrl: `https://downloads.example.com/builds/${sanitizedName}.${format === 'apk' ? 'apk' : 'zip'}`,
        fileSize: format === 'apk' ? '24.5 MB' : '4.2 MB',
        format
      });
    }, 2000);
  });
}
