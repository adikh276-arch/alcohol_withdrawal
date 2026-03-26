# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html/alcohol_withdrawal
COPY --from=build /app/dist /usr/share/nginx/html/alcohol_withdrawal
COPY vite-nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
