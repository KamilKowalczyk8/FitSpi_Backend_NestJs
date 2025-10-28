import { Module } from '@nestjs/common';
import { ClientLinkService } from './client-links.service';
import { ClientLinkController } from './client-links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientLink } from './entities/client-link.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientLink, User])],
  controllers: [ClientLinkController],
  providers: [ClientLinkService],
})
export class ClientLinksModule {}
