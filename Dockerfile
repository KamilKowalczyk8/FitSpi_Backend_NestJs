# 1. Stage build (deweloperski i do budowania)
FROM node:20 AS builder
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy WSZYSTKIE zależności (w tym devDependencies)
RUN npm install

# Kopiujemy cały kod
# (Dzięki .dockerignore, node_modules i dist są pomijane)
COPY . .

# Budujemy aplikację (stworzy /app/dist)
RUN npm run build


# 2. Stage runtime (produkcyjny)
FROM node:20 AS runner
WORKDIR /app

# Ustawiamy domyślnie środowisko produkcyjne
ENV NODE_ENV=production

# Kopiujemy tylko pliki potrzebne do uruchomienia
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instalujemy tylko produkcyjne zależności
RUN npm install --omit=dev

# Uruchamiamy aplikację w trybie produkcyjnym
# To jest domyślne polecenie, jeśli nie używamy start:dev
CMD ["node", "dist/main.js"]