# 1. Użyj bazowego obrazu Node 20
FROM node:20
# 2. Ustaw folder roboczy w kontenerze
WORKDIR /app
# 3. Skopiuj pliki zależności
COPY package*.json ./
# 4. Zainstaluj WSZYSTKIE zależności
RUN npm install
# 5. Skopiuj resztę kodu
COPY . .
# 6. Ustaw domyślne polecenie startowe
CMD ["npm", "run", "start:dev"]