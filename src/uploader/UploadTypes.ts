export enum SaveType {
  SAVE = 'SAVE',
  UPDATE = 'UPDATE',
}

export interface SaveDto {
  type?: SaveType;
  files: any[];
  data?: any;
}

export type ImageFormat = '.webp' | '.avif';
