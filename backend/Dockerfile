FROM node:14-alpine AS builder

WORKDIR /usr/src/app

COPY ../package.json ../package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm install --only=production

COPY --from=builder /usr/src/app ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 5000

CMD ["npm", "start"]