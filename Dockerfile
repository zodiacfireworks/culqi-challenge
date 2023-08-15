# ------------------------------------------------------------------------------
# Build stage
# ------------------------------------------------------------------------------
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# ------------------------------------------------------------------------------
# Production stage
# ------------------------------------------------------------------------------
FROM node:18-alpine as runner

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
