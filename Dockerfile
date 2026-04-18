FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./

# Create logs directory and set permissions
RUN mkdir -p logs && chmod 777 logs

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
