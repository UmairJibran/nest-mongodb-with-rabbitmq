import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ImageService', () => {
    let service: ImageService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [ImageService],
      }).compile();

      service = module.get<ImageService>(ImageService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should save an image and return file path and hash', () => {
      const fileBuffer = Buffer.from('test image');
      const imageHash = service.generateImageHash(fileBuffer);
      const filePath = path.join(service['storagePath'], `${imageHash}.jpg`);

      const result = service.saveImage(fileBuffer);

      expect(result).toEqual({ filePath, imageHash });
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, fileBuffer);
    });

    it('should return image as base64 string', () => {
      const filePath = 'uploads/avatars/image.jpg';
      const fileBuffer = Buffer.from('test image');
      (fs.readFileSync as jest.Mock).mockReturnValue(fileBuffer);

      const result = service.getImageAsBase64(filePath);

      expect(result).toBe(fileBuffer.toString('base64'));
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
    });

    it('should delete an image', () => {
      const filePath = 'uploads/avatars/image.jpg';
      service.deleteImage(filePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
    });

    it('should generate a hash for an image', () => {
      const fileBuffer = Buffer.from('test image');
      const hash = service.generateImageHash(fileBuffer);

      expect(hash).toBe(createHash('sha256').update(fileBuffer).digest('hex'));
    });
  });
});
