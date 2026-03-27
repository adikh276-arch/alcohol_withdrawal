# Build stage
FROM node:22-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to appropriate subdirectory
RUN mkdir -p /usr/share/nginx/html/alcohol_withdrawal
COPY --from=build /app/dist /usr/share/nginx/html/alcohol_withdrawal/

# Copy Nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
CMD ["/entrypoint.sh"]
