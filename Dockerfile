# 1. Bazowy obraz Node.js
FROM node:20

# 2. Katalog roboczy
WORKDIR /app

# 3. Kopiowanie package.json i package-lock.json
COPY package*.json ./

# 4. Instalacja zależności
RUN npm install

# 5. Kopiowanie reszty kodu
COPY . .

# 6. Kompilacja NestJS (jeśli TypeScript)
RUN npm install --no-optional

# 7. Start
CMD ["npm", "run", "start:prod"]
