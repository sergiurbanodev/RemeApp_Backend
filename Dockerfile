FROM node:lts-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "start:dev"]