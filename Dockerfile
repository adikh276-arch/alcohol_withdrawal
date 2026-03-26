# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/server.ts ./src/server.ts
COPY --from=build /app/src/lib/db.ts ./src/lib/db.ts
COPY --from=build /app/database/schema.sql ./database/schema.sql
COPY --from=build /app/vite.config.ts ./vite.config.ts

# Install tsx to run the server
RUN npm install -g tsx

EXPOSE 8080
ENV NODE_ENV=production
CMD ["tsx", "src/server.ts"]
