# 1. Użyj bazowego obrazu Node 20
FROM node:20

# 2. Ustaw folder roboczy w kontenerze
WORKDIR /app

# 3. Skopiuj pliki zależności
COPY package*.json ./

# 4. Zainstaluj WSZYSTKIE zależności (w tym devDependencies)
RUN npm install

# 5. Skopiuj resztę kodu (dzięki .dockerignore, lokalne node_modules zostaną pominięte)
COPY . .

# 6. Ustaw domyślne polecenie startowe na tryb 'watch'
CMD ["npm", "run", "start:dev"]