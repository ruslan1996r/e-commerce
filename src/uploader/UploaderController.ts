import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { UploaderService } from './UploaderService';

@Controller('/static')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}
  // * Для получения изображения: {url}/static/original/{id}

  @Post('/save')
  saveFiles(
    @Body() data: any,
    @Req() req: Request & { files: any },
  ): Promise<any> {
    const { files } = req;
    return this.uploaderService.saveFiles({ files, data });
  }

  @Post('/delete')
  async deleteFiles(@Body() ids: string[]): Promise<any> {
    const result = await this.uploaderService.deleteFiles(ids);
    if (!result.success) {
      throw new NotFoundException(result);
    }
    return { ...result };
  }

  @Put('/update')
  async updateFiles(@Req() req: Request): Promise<any> {
    const { files } = req;
    const result = await this.uploaderService.updateFiles(files);
    if (!result.success) {
      throw new BadRequestException(result);
    }
    return { ...result };
  }
}
