import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'custom:message';

export const SetMessage = (message: string) =>
  SetMetadata(MESSAGE_KEY, message);
