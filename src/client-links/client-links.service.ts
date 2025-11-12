import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ClientLink } from './entities/client-link.entity';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/role.enum';
import { LinkStatus } from './entities/link-status.enum';

@Injectable()
export class ClientLinkService {
  constructor(
    @InjectRepository(ClientLink)
    private readonly linkRepo: Repository<ClientLink>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async sendInvitation(trainer: User, clientEmail: string) {
    if (trainer.role_id !== Role.Trainer) {
      throw new ForbiddenException('Tylko trenerzy mogą wysyłać zaproszenia');
    }

    const client = await this.userRepo.findOne({ where: { email: clientEmail } });
    if (!client) {
      throw new NotFoundException('Nie znaleziono użytkownika o tym emailu');
    }
    if (client.role_id === Role.Trainer) {
      throw new ConflictException('Nie możesz zaprosić innego trenera');
    }
    if (client.user_id === trainer.user_id) {
      throw new ConflictException('Nie możesz zaprosić samego siebie');
    }


    const existingAcceptedLink = await this.linkRepo.findOne({
      where: { clientId: client.user_id, status: LinkStatus.Accepted },
    });
    if (existingAcceptedLink) {
      throw new ConflictException('Ten użytkownik jest już podopiecznym innego trenera');
    }

 
    const existingPendingLink = await this.linkRepo.findOne({
      where: { trainerId: trainer.user_id, clientId: client.user_id, status: LinkStatus.Pending },
    });
    if (existingPendingLink) {
      throw new ConflictException('Wysłałeś już oczekujące zaproszenie do tego użytkownika');
    }

    const link = this.linkRepo.create({
      trainerId: trainer.user_id,
      clientId: client.user_id,
      status: LinkStatus.Pending,
    });
    await this.linkRepo.save(link);

    return { message: 'Zaproszenie zostało wysłane' };
  }


  async getPendingForClient(client: User) {
    const links = await this.linkRepo.find({
      where: { clientId: client.user_id, status: LinkStatus.Pending },
      relations: ['trainer'],
    });

    return links.map(link => ({
        id: link.id,
        status: link.status,
        createdAt: link.createdAt,
        trainer: link.trainer.safeResponse(),
    }));
  }


  async respondToInvitation(client: User, linkId: number, accept: boolean) {
    const link = await this.linkRepo.findOne({
        where: { id: linkId, status: LinkStatus.Pending }
    });
    if (!link) {
      throw new NotFoundException('Nie znaleziono zaproszenia lub już na nie odpowiedziano');
    }


    if (link.clientId !== client.user_id) {
      throw new ForbiddenException('To zaproszenie nie jest dla Ciebie');
    }

    if (accept) {
      const existingAcceptedLink = await this.linkRepo.findOne({
        where: { clientId: client.user_id, status: LinkStatus.Accepted },
      });
      if (existingAcceptedLink) {
        throw new ConflictException('Masz już aktywnego trenera. Odrzuć poprzedniego, aby zaakceptować nowego.');
      }

      link.status = LinkStatus.Accepted;

      await this.linkRepo.update(
        { clientId: client.user_id, status: LinkStatus.Pending, id: Not(linkId) },
        { status: LinkStatus.Rejected }
      );

    } else {
      link.status = LinkStatus.Rejected;
    }

    await this.linkRepo.save(link);
    return { message: `Zaproszenie zostało ${accept ? 'zaakceptowane' : 'odrzucone'}` };
  }

  async getMyClients(trainer: User) {
    if (trainer.role_id !== Role.Trainer) {
      throw new ForbiddenException('Nie jesteś trenerem');
    }
    const links = await this.linkRepo.find({
        where: { trainerId: trainer.user_id, status: LinkStatus.Accepted },
        relations: ['client']
    });

    return links.map(link => link.client.safeResponse());
  }


  /**
   * [TRENER] Usuwa powiązanie ze swoim podopiecznym
   */
  async deleteClient(trainer: User, clientId: number): Promise<{ message: string }> {
    if (trainer.role_id !== Role.Trainer) {
      throw new ForbiddenException('Nie jesteś trenerem');
    }

    const link = await this.linkRepo.findOne({
      where: {
        trainerId: trainer.user_id,
        clientId: clientId,
        status: LinkStatus.Accepted, 
      },
    });

    if (!link) {
      throw new NotFoundException('Nie znaleziono takiego podopiecznego');
    }

    await this.linkRepo.remove(link);
    return { message: 'Podopieczny został pomyślnie usunięty' };
  }
}
