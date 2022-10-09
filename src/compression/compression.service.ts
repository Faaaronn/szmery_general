import { Injectable } from '@nestjs/common';
import AdmZip = require('adm-zip');

@Injectable()
export class CompressionService {
  async zipFiles(files: { name: string; content: Buffer }[]) {
    const zip = new AdmZip();
    for (const file of files) {
      zip.addFile(`${file.name}`, file.content);
    }
    const zipFileContents = zip.toBuffer();
    return zipFileContents;
  }
}
