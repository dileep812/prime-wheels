# ---- Stage 1: Build Frontend ----
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Backend Dependencies ----
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# ---- Stage 3: Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy production dependencies and built frontend
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY backend/ ./backend/

# Setup logs directory
RUN mkdir -p /app/backend/logs && chown -R app:app /app/backend/logs

# Switch to backend directory for execution
WORKDIR /app/backend
USER app

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
