# 1. Stage build
FROM node:20 AS builder
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy wszystkie zależności
RUN npm install

# Kopiujemy cały kod
COPY . .

# Budujemy NestJS (wygeneruje dist/)
RUN npm run build


# 2. Stage runtime
FROM node:20 AS runner
WORKDIR /app

# Kopiujemy tylko pliki potrzebne do uruchomienia
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instalujemy tylko produkcyjne zależności
RUN npm install --omit=dev

# Włącz tryb produkcyjny
ENV NODE_ENV=production

# Uruchamiamy aplikację NestJS
CMD ["node", "dist/main.js"]
