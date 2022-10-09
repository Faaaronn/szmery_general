import { Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';

@Injectable()
export class CompressionService {
  async zipFiles(files: { name: string; content: Buffer }[]) {
    const zip = new AdmZip();

    for (const file of files) {
      // if (file.folder) {
      //   zip.addFile(`${file.folder}/${file.name}`, file.content);
      // } else {
      zip.addFile(`${file.name}`, file.content);
      // }
    }
    const zipFileContents = zip.toBuffer();

    return zipFileContents;
  }
}
