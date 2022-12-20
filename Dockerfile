FROM node

USER node

# Setup SSH access
RUN mkdir ~/.ssh
RUN ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
COPY --chown=node id_ed25519 /home/node/.ssh/
RUN chmod 400 /home/node/.ssh/id_ed25519
RUN \
  eval "$(ssh-agent -s)" \
  ssh-add ~/.ssh/id_ed25519

# Clone the repo
RUN git clone git@github.com:softeria-test/vue-grid-component.git /home/node/vue-grid-component
