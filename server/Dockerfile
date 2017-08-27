FROM mhart/alpine-node:8
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install --production
COPY . /usr/src/app/

CMD npm start
