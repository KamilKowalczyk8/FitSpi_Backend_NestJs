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

  /**
   * Trener wysyła zaproszenie do użytkownika po emailu
   */
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

    // Sprawdź, czy ten klient ma już aktywnego trenera
    const existingAcceptedLink = await this.linkRepo.findOne({
      where: { clientId: client.user_id, status: LinkStatus.Accepted },
    });
    if (existingAcceptedLink) {
      throw new ConflictException('Ten użytkownik jest już podopiecznym innego trenera');
    }

    // Sprawdź, czy już wysłałeś zaproszenie
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

  /**
   * Klient pobiera swoje oczekujące zaproszenia
   */
  async getPendingForClient(client: User) {
    const links = await this.linkRepo.find({
      where: { clientId: client.user_id, status: LinkStatus.Pending },
      relations: ['trainer'],
    });

    // Zwróć listę zaproszeń z (bezpiecznymi) danymi trenera
    return links.map(link => ({
        id: link.id,
        status: link.status,
        createdAt: link.createdAt,
        trainer: link.trainer.safeResponse(),
    }));
  }

  /**
   * Klient odpowiada na zaproszenie (Akceptuje lub Odrzuca)
   */
  async respondToInvitation(client: User, linkId: number, accept: boolean) {
    const link = await this.linkRepo.findOne({
        where: { id: linkId, status: LinkStatus.Pending }
    });
    if (!link) {
      throw new NotFoundException('Nie znaleziono zaproszenia lub już na nie odpowiedziano');
    }

    // Sprawdź, czy to na pewno zaproszenie dla tego klienta
    if (link.clientId !== client.user_id) {
      throw new ForbiddenException('To zaproszenie nie jest dla Ciebie');
    }

    if (accept) {
      // Sprawdź, czy w międzyczasie nie zaakceptował innego
      const existingAcceptedLink = await this.linkRepo.findOne({
        where: { clientId: client.user_id, status: LinkStatus.Accepted },
      });
      if (existingAcceptedLink) {
        throw new ConflictException('Masz już aktywnego trenera. Odrzuć poprzedniego, aby zaakceptować nowego.');
      }

      link.status = LinkStatus.Accepted;

      // Opcjonalnie: automatycznie odrzuć wszystkie inne oczekujące zaproszenia
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

  /**
   * Trener pobiera listę swoich podopiecznych
   */
  async getMyClients(trainer: User) {
    if (trainer.role_id !== Role.Trainer) {
      throw new ForbiddenException('Nie jesteś trenerem');
    }
    const links = await this.linkRepo.find({
        where: { trainerId: trainer.user_id, status: LinkStatus.Accepted },
        relations: ['client']
    });

    // Zwróć tylko listę bezpiecznych danych klientów
    return links.map(link => link.client.safeResponse());
  }
}