FROM node:22-alpine AS build
WORKDIR /app
COPY client/package*.json ./client/
RUN npm --prefix client install
COPY client ./client
RUN npm --prefix client run build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY server/package*.json ./server/
RUN npm --prefix server install --omit=dev
COPY server ./server
COPY --from=build /app/client/dist ./client/dist
USER node
EXPOSE 3000
CMD ["node", "server/index.js"]
