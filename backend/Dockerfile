FROM node:14.17.0-alpine AS build
WORKDIR /app
ADD ./backend/package.json ./backend/package.json
ADD ./backend/yarn.lock ./backend/yarn.lock
RUN cd ./backend && yarn install
ADD ./backend/ ./backend/
RUN cd ./backend && yarn build

FROM node:14.17.0-alpine
COPY --from=build /app/backend/dist/ ./dist/
COPY --from=build /app/backend/node_modules/ ./node_modules/
COPY --from=build /app/backend/package.json .
EXPOSE 3000
CMD NODE_TLS_REJECT_UNAUTHORIZED='0' yarn start:prod
