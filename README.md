# vue-grid-component

> A grid component, written with Vue.js 2.7, composition API, TypeScript, SonarQube and Jest

## Requirements

1. Fetch this repository into your local (You can clone with Git or copy only `Dockerfile`, `Dockerfile.ssh` and `docker-compose.yml` files)
1. [Install Docker](https://www.docker.com/products/docker-desktop/)
1. [Install VS Code](https://code.visualstudio.com/download)
1. [Install "Dev Containers" VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
1. Open a terminal in the project path

## Run development server (for maintainers)

At first, you should [generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent), [add it to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) and copy the private key into the project key.

```sh
docker compose up node-ssh
```

Then navigate to [http://localhost:8080](http://localhost:8080) to view the project.

You can use [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code extension to open a VS Code instance in this container.

## Run development server (for non-maintainers)

```sh
docker compose up node
```

Then navigate to [http://localhost:8080](http://localhost:8080) to view the project.

You can use [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code extension to open a VS Code instance in this container.

## Available scripts to run in dev container

### Install dependencies

```sh
yarn install
```

### Compiles and hot-reloads for development

```sh
yarn serve
```

### Compiles and minifies for production

```sh
yarn build
```

### Run your unit tests

```sh
yarn test:unit
```

### Lints files

```sh
yarn lint
```

## Run your end-to-end tests

At first, you should run the `node` container:

```sh
docker compose up node
```

Then, in a different terminal session, you can run the related container to run your end-to-end tests with Cypress:

```sh
docker compose up cypress
```

## Run SonarScanner

At first, you should run the `node` container:

```sh
docker compose up node
```

Then, in a different terminal session, you should start the `sonarqube`:

```sh
docker compose up sonarqube
```

After then, you should navigate to [http://localhost:9000](http://localhost:9000) to create a project key and token, and you should add those to a file named `docker-compose.override.yml` like this:

```yml
services:
  sonar-scanner:
    environment:
      - SONAR_SCANNER_OPTS=-Dsonar.projectKey=your-project-key
      - SONAR_LOGIN=your-project-token
```

Then, again in a different terminal session, you can run the related container to run `sonar-scanner`:

```sh
docker compose up sonar-scanner
```

Then navigate to `http://localhost:9000/dashboard?id=${your-project-key}` to get the dashboard for this project.

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
