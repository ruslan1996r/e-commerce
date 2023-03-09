import { Injectable, Logger } from '@nestjs/common';
import { resolve } from 'path';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { SaveType, SaveDto, ImageFormat } from './UploadTypes';

@Injectable()
export class UploaderService {
  private readonly logger: Logger = new Logger(UploaderService.name);
  private readonly imgFormat: ImageFormat = '.webp';
  private getKB = (size: number) => `${(size / 1000).toFixed(1)} KB`;
  private getPath = (pathParts: string[]) =>
    resolve(__dirname, '../../static/', pathParts.join('/'));

  private async saveOriginal(file: any, fileId: string) {
    const fileName = `${fileId}${this.imgFormat}`;

    const result = await sharp(file.data)
      .webp()
      .toFile(this.getPath(['original', fileName]));

    this.logger.log(`ORIGINAL ${file.name}: `, this.getKB(result.size));
    return fileName;
  }

  private async saveBlured(file: any, fileId: string) {
    const fileName = `${fileId}${this.imgFormat}`;

    const result = await sharp(file.data)
      .webp({ quality: 30 })
      .blur(40)
      .toFile(this.getPath(['blured', fileName]));

    this.logger.log(`BLURED ${file.name}: `, this.getKB(result.size));
    return fileName;
  }

  private async saveMobile(file: any, fileId: string) {
    const fileName = `${fileId}${this.imgFormat}`;
    const resizePercentage = 0.4;

    const { width, height } = await sharp(file.data).metadata();

    const result = await sharp(file.data)
      .resize({
        width: Math.round(width * resizePercentage),
        height: Math.round(height * resizePercentage),
      })
      .webp()
      .toFile(this.getPath(['mobile', fileName]));

    this.logger.log(`MOBILE ${file.name}: `, this.getKB(result.size));
    return fileName;
  }

  // 14.3 sec for 6 files
  // 5.3 sec for Promise.all()
  // 19.90 for avif

  async saveFiles({ files, type = SaveType.SAVE }: SaveDto): Promise<any> {
    const saved = {};
    const filesPromises = [];
    const filesIds = [];

    for (const [key, file] of Object.entries(files)) {
      // Если сохранение - сгенерируй ID, если обновление - возьми существующий ID
      const fileId = type === SaveType.SAVE ? uuidv4() : key;

      filesIds.push(fileId);
      filesPromises.push(this.saveOriginal(file, fileId));
      filesPromises.push(this.saveBlured(file, fileId));
      filesPromises.push(this.saveMobile(file, fileId));

      saved[key] = `${fileId}${this.imgFormat}`;
    }

    await Promise.all(filesPromises);

    this.logger.verbose(`[${filesIds.map((el) => `"${el}"`)}]`, 'FilesIds');

    return saved;
  }

  async deleteFiles(ids: string[]) {
    try {
      const filesPromises = [];

      for (let i = 0; i < ids.length; i++) {
        const fileName = `${ids[i]}${this.imgFormat}`;

        filesPromises.push(unlink(this.getPath(['original', fileName])));
        filesPromises.push(unlink(this.getPath(['blured', fileName])));
        filesPromises.push(unlink(this.getPath(['mobile', fileName])));
      }

      await Promise.all(filesPromises);

      return { success: true };
    } catch (err) {
      return err;
    }
  }

  async updateFiles(files: any) {
    try {
      await this.deleteFiles(Object.keys(files));
      await this.saveFiles({ files, type: SaveType.UPDATE });

      return { success: true };
    } catch (err) {
      return err;
    }
  }
}
