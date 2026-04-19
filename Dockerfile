# ── Stage 1: Build React frontend ──────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Backend + serve frontend ──────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

# Copy built frontend into backend's public folder
COPY --from=frontend-build /app/frontend/dist ./public

# Cloud Run uses PORT env variable
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
