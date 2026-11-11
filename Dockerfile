# Multi-stage Docker build for NexusPay
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production runtime stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/apimatic.json ./apimatic.json
COPY --from=builder /app/LICENSE ./LICENSE

EXPOSE 5000

CMD ["node", "server/server.js"]
