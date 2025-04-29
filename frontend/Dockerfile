FROM node:20 AS builder
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build

# Stage for serving the built Angular app
FROM nginx:alpine
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
