<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# FitSpi (Backend) - REST API

**FitSpi API** to warstwa serwerowa (backend) systemu fitness, zrealizowana w oparciu o framework **NestJS**. Aplikacja dostarcza logikę biznesową, zarządza bazą danych oraz zapewnia bezpieczną komunikację dla aplikacji mobilnej.

Projekt stanowi część pracy inżynierskiej zrealizowanej na kierunku Informatyka (Uniwersytet Dolnośląski DSW).

> **Uwaga:** To repozytorium zawiera kod serwera. Kod aplikacji mobilnej (Frontend) znajduje się tutaj: https://github.com/KamilKowalczyk8/FitSpi_React_Native

## 🛠️ Stack Technologiczny

Backend został zaprojektowany z naciskiem na skalowalność, bezpieczeństwo i modułowość.

* [cite_start]**Framework:** [NestJS](https://nestjs.com/) (Node.js) – architektura modułowa inspirowana Angular[cite: 1776].
* [cite_start]**Język:** TypeScript – pełne typowanie statyczne[cite: 1772].
* [cite_start]**Baza danych:** PostgreSQL (Relacyjna baza danych)[cite: 1787].
* [cite_start]**ORM:** TypeORM – mapowanie obiektowo-relacyjne, migracje, relacje (OneToMany, ManyToOne)[cite: 1802].
* [cite_start]**Konteneryzacja:** Docker & Docker Compose[cite: 1815].

## 🔐 Bezpieczeństwo i Autoryzacja

[cite_start]W projekcie wdrożono wielowarstwowe mechanizmy bezpieczeństwa[cite: 2295]:

* [cite_start]**JWT (JSON Web Token):** Uwierzytelnianie bezstanowe (Stateless) z użyciem strategii Passport.js[cite: 2273].
* [cite_start]**Role-Based Access Control (RBAC):** System ról (`Admin`, `User`, `Trainer`) chroniący dostęp do specyficznych endpointów (Guardy)[cite: 2334].
* [cite_start]**Haszowanie haseł:** Wykorzystanie algorytmu **Bcrypt** z mechanizmem "solenia"[cite: 2296].
* [cite_start]**Walidacja danych:** Globalny `ValidationPipe` z wykorzystciem `class-validator` (DTO) chroniący przed błędnymi danymi[cite: 2306].
* **Ochrona API:**
    * [cite_start]**Helmet:** Zabezpieczenie nagłówków HTTP[cite: 2361].
    * [cite_start]**Throttler (Rate Limiting):** Ochrona przed atakami Brute Force i DDoS[cite: 2345].
    * [cite_start]**SQL Injection:** Ochrona poprzez parametryzację zapytań w TypeORM[cite: 2365].

## 🏗️ Architektura i Moduły

[cite_start]Aplikacja podzielona jest na domeny logiczne[cite: 2220]:

* **AuthModule:** Logowanie, rejestracja, generowanie tokenów JWT.
* [cite_start]**WorkoutModule:** Zarządzanie planami treningowymi, statusami (Szkic -> Wysłany -> Zaakceptowany) i logiką kopiowania treningów[cite: 2226].
* **ExerciseModule:** Baza ćwiczeń i ich parametrów.
* [cite_start]**ClientLinksModule:** Obsługa relacji Trener-Podopieczny (zaproszenia, status współpracy)[cite: 2234].
* [cite_start]**DietModule (Foods/Products/DailyLog):** Zarządzanie dziennikiem żywieniowym, bazą produktów i wyliczanie makroskładników[cite: 2230].
* [cite_start]**UserProfileModule:** Zarządzanie biometrią i automatyczne wyliczanie zapotrzebowania (BMR/CPM)[cite: 2237].

## ⚙️ Instalacja i Uruchomienie

Projekt jest w pełni skonteneryzowany, co zalecam jako główną metodę uruchamiania.

### Wymagania
* Docker & Docker Compose
* Node.js (opcjonalnie, do uruchamiania lokalnego bez Dockera)

### Krok 1: Konfiguracja zmiennych środowiskowych
[cite_start]Utwórz plik `.env` w głównym katalogu projektu na podstawie poniższego wzoru[cite: 3085]:

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
