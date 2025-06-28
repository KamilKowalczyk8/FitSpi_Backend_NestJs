/*import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerModule,
  ThrottlerGuard,
  ThrottlerConfig,
  THROTTLER_CONFIG,
} from '@nestjs/throttler';

@Module({
  imports: [ThrottlerModule.forRoot()],
  providers: [
    {
      provide: THROTTLER_CONFIG,
      useValue: {
        ttl: 60,
        limit: 10,
      } satisfies ThrottlerConfig,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class SecurityModule {}*/
