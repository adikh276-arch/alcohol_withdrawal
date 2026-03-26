# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run build:server

# Production stage
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/database/schema.sql ./database/schema.sql

EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "dist-server/server.cjs"]
