# 1. Stage build
FROM node:20 AS builder
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności (dev + prod)
RUN npm install

# Kopiujemy resztę kodu
COPY . .

# Budujemy NestJS -> powstaje dist/
RUN npm run build

# 2. Stage runtime
FROM node:20 AS runner
WORKDIR /app

# Kopiujemy tylko potrzebne pliki z buildera
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instalujemy tylko zależności produkcyjne
RUN npm install --omit=dev

# Uruchamiamy NestJS w trybie prod
CMD ["node", "dist/main.js"]
