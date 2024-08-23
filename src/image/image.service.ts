import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly storagePath = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    'avatars',
  );

  saveImage(file: Buffer): { filePath: string; imageHash: string } {
    const imageHash = this.generateImageHash(file);
    const filePath = path.join(this.storagePath, `${imageHash}.jpg`);
    fs.writeFileSync(filePath, file);
    return { filePath, imageHash };
  }

  getImageAsBase64(filePath: string): string {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString('base64');
  }

  deleteImage(filePath: string): void {
    fs.unlinkSync(filePath);
  }

  generateImageHash(imageBuffer: Buffer): string {
    return createHash('sha256').update(imageBuffer).digest('hex');
  }
}
