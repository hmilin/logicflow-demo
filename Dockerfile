FROM node:18-alpine as builder

WORKDIR /staros
RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./
COPY patches/ ./patches/

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --no-optional

COPY . .
RUN pnpm build

FROM nginx:1.23.3

WORKDIR /cloudos/web

# Redirect standard output and error stream
RUN mkdir -p logs && \
  ln -s /dev/stdout logs/access.log && \
  ln -s /dev/stderr logs/error.log

COPY nginx/startup.sh .
COPY nginx/conf/ conf/
COPY --from=builder /staros/dist/ html/

ENV CONTAINERIZED true

EXPOSE 80
# Run Command
CMD sh startup.sh
