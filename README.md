# vue-grid-component

> A grid component, written with Vue.js 2.7, composition API, TypeScript, SonarQube and Jest

## Requirements

- [Install Node.js](https://nodejs.org/en/download/)
- [Install Docker](https://www.docker.com/products/docker-desktop/)

## Project setup

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

### Run your end-to-end tests

```sh
yarn test:e2e
```

### Lints files

```sh
yarn lint
```

### Run SonarScanner

- Start SonarQube: `yarn start-sonarqube`
- docker run --rm -e SONAR_HOST_URL="${SONARQUBE_URL}" -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=${PROJECT_KEY}" -e SONAR_LOGIN="${AUTH_TOKEN}" -v "${PROJECT_PATH}:/usr/src" sonarsource/sonar-scanner-cli
- Then navigate to `http://localhost:9000/dashboard?id=${PROJECT_KEY}` to get the dashboard for this project

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
