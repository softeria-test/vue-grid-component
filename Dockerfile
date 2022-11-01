FROM node

# Add Tini as a lightweight process wrapper to make handling process events more solid (https://bit.ly/3SSWMN8)
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN \
  gpg --batch --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 && \
  gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

USER node

# Clone the repo
RUN git clone https://github.com/softeria-test/vue-grid-component.git ~/vue-grid-component
WORKDIR /home/node/vue-grid-component
# Install dependencies
RUN yarn install
