import { Request, Response } from 'express';

import { UserEntity } from '@root/database/entities';

export type ContextSchema = {
  req: Request & { session: any }; // Express.Session
  res: Response;
  redis: any;
  getUser: () => UserEntity;
  // userLoader: ReturnType<typeof createUserLoader>,
  // updootLoader: ReturnType<typeof createUpdootLoader>,
  // [key: string]: any;
};
