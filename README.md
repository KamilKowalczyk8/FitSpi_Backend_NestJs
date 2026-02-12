<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# FitSpi (Backend) - REST API

**FitSpi API** to warstwa serwerowa (backend) systemu fitness, zrealizowana w oparciu o framework **NestJS**. Aplikacja dostarcza logikę biznesową, zarządza bazą danych oraz zapewnia bezpieczną komunikację dla aplikacji mobilnej.

Projekt stanowi część pracy inżynierskiej zrealizowanej na kierunku Informatyka (Uniwersytet Dolnośląski DSW).

> **Uwaga:** To repozytorium zawiera kod serwera. Kod aplikacji mobilnej (Frontend) znajduje się tutaj: https://github.com/KamilKowalczyk8/FitSpi_React_Native

##  Stack Technologiczny

Backend został zaprojektowany z naciskiem na skalowalność, bezpieczeństwo i modułowość.

* **Framework:** [NestJS](https://nestjs.com/) (Node.js) – architektura modułowa inspirowana Angular.
* **Język:** TypeScript – pełne typowanie statyczne.
* **Baza danych:** PostgreSQL (Relacyjna baza danych).
* **ORM:** TypeORM – mapowanie obiektowo-relacyjne, migracje, relacje (OneToMany, ManyToOne).
* **Konteneryzacja:** Docker & Docker Compose.

##  Bezpieczeństwo i Autoryzacja

W projekcie wdrożono wielowarstwowe mechanizmy bezpieczeństwa:

* **JWT (JSON Web Token):** Uwierzytelnianie bezstanowe (Stateless) z użyciem strategii Passport.js.
* **Role-Based Access Control (RBAC):** System ról (`Admin`, `User`, `Trainer`) chroniący dostęp do specyficznych endpointów (Guardy).
* **Haszowanie haseł:** Wykorzystanie algorytmu **Bcrypt** z mechanizmem "solenia".
* **Walidacja danych:** Globalny `ValidationPipe` z wykorzystciem `class-validator` (DTO) chroniący przed błędnymi danymi.
* **Ochrona API:**
    * **Helmet:** Zabezpieczenie nagłówków HTTP.
    * **Throttler (Rate Limiting):** Ochrona przed atakami Brute Force i DDoS.
    * **SQL Injection:** Ochrona poprzez parametryzację zapytań w TypeORM.

##  Architektura i Moduły

Aplikacja podzielona jest na domeny logiczne:

* **AuthModule:** Logowanie, rejestracja, generowanie tokenów JWT.
* **WorkoutModule:** Zarządzanie planami treningowymi, statusami (Szkic -> Wysłany -> Zaakceptowany) i logiką kopiowania treningów.
* **ExerciseModule:** Baza ćwiczeń i ich parametrów.
* **ClientLinksModule:** Obsługa relacji Trener-Podopieczny (zaproszenia, status współpracy).
* **DietModule (Foods/Products/DailyLog):** Zarządzanie dziennikiem żywieniowym, bazą produktów i wyliczanie makroskładników.
* **UserProfileModule:** Zarządzanie biometrią i automatyczne wyliczanie zapotrzebowania (BMR/CPM).

##  Instalacja i Uruchomienie

Projekt jest w pełni skonteneryzowany, co zalecam jako główną metodę uruchamiania.

### Wymagania
* Docker & Docker Compose
* Node.js (opcjonalnie, do uruchamiania lokalnego bez Dockera)

### Krok 1: Konfiguracja zmiennych środowiskowych
Utwórz plik `.env` w głównym katalogu projektu na podstawie poniższego wzoru:

```env
# Konfiguracja Bazy Danych
DB_HOST=postgres
DB_PORT=5432
DB_USER=twoj_user
DB_PASSWORD=twoje_haslo
DB_NAME=fitspi_db

# Konfiguracja JWT
JWT_SECRET=tajny_klucz_jwt
JWT_REFRESH_SECRET=tajny_klucz_refresh

# Inne
PORT=4000
CORS_ORIGIN=*

```

### Krok 2: Uruchomienie z Dockerem

Uruchomienie bazy danych PostgreSQL oraz aplikacji API jednym poleceniem:
**docker-compose up --build**


### Dokumentacja API (Swagger)
Aplikacja posiada automatycznie generowaną dokumentację w standardzie OpenAPI (Swagger).
Po uruchomieniu serwera dokumentacja jest dostępna pod adresem:

**http://localhost:4000/api/docs**

Umożliwia ona testowanie endpointów i autoryzacji bezpośrednio z przeglądarki.


### Testowanie

Projekt zawiera testy jednostkowe (Unit Tests) wykorzystujące framework Jest.

**npm run test**

