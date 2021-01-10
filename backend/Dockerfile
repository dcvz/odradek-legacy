FROM node:10.13-alpine AS build
WORKDIR /app
ADD ./backend/package.json ./backend/package.json
ADD ./backend/yarn.lock ./backend/yarn.lock
RUN cd ./backend && yarn install
ADD ./backend/ ./backend/
RUN cd ./backend && yarn build

FROM node:10.13-alpine
COPY --from=build /app/backend/dist/ ./dist/
COPY --from=build /app/backend/node_modules/ ./node_modules/
EXPOSE 3000
CMD ["sh", "-c", "node ./dist/public.js"]
