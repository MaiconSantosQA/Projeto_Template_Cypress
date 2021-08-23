from node:12

ENV CURL_VERSION=7.72.0

RUN apt-get update

RUN apt-get remove -y curl
RUN apt-get purge -y curl

RUN apt-get install -y libssl-dev autoconf libtool make
RUN wget https://curl.haxx.se/download/curl-${CURL_VERSION}.zip
RUN unzip curl-${CURL_VERSION}.zip && \
  cd curl-${CURL_VERSION} && \
  ./buildconf && \
  ./configure --with-ssl && \
  make && \
  make install

RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

WORKDIR = '/app'

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ['npm', 'run', 'test']