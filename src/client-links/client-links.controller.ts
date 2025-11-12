import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';
import { ClientLinkService } from './client-links.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SendInvitationDto } from './dto/send-invitation.dto';
import { RespondInvitationDto } from './dto/respond-invitation.dto';

@ApiTags('Client Links')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('client-links')
export class ClientLinkController {
  constructor(private readonly linkService: ClientLinkService) {}

  @Post('invite')
  @ApiOperation({ summary: '[TRENER] Wyszukaj i zaproś podopiecznegopo emailu' })
  sendInvitation(
    @GetUser() trainer: User,
    @Body() dto: SendInvitationDto,
  ) {
    return this.linkService.sendInvitation(trainer, dto.clientEmail);
  }

  @Get('pending')
  @ApiOperation({ summary: '[KLIENT] Pobierz oczeukjące zaproszenia od trenerów' })
  getPendingInvitations(@GetUser() client:User) {
      return this.linkService.getPendingForClient(client);
  }

  @Patch(':linkId/respond')
  @ApiOperation({ summary: '[KLIENT] Zaakceptuj lub ordzuc zaproszenie' })
  respondToInvitation(
    @GetUser() client: User,
    @Param('linkId', ParseIntPipe) linkId: number,
    @Body() dto:RespondInvitationDto,
  ) {
    return this.linkService.respondToInvitation(client, linkId, dto.accept);
  }

  @Get('my-clients')
  @ApiOperation({ summary: '[TRENER] Pobierz listę swoich podpoiecznych (zaakceptowanych)'})
  getMyClients(@GetUser() trainer: User) {
    return this.linkService.getMyClients(trainer);
  }

  @Delete('my-clients/:clientId')
  @ApiOperation({ summary: '[TRENER] Usuwa powiązanie ze swoim podopiecznym' })
  deleteClient(
    @GetUser() trainer: User,
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    return this.linkService.deleteClient(trainer, clientId);
  }
}
