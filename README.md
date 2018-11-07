# Gerencio Upgrade

This script upgrades a single service to a new container ID in a target gerenc.io environment. It does this by wrapping "rancher-compose upgrade A B" and providing all the requisite environment parameters via environment variables.

## Getting Started

1. [sudo] `$ npm install -g gerencio-upgrade`
2. `$ gerencio-upgrade --service-name <serviceName> --docker-image <dockerImage>:<dockerTag>`, ej: `$ gerencio-upgrade nodecolor xdevelsistemas/taiga-docker:0.3.1`

### Prerequisites

* [NodeJS (>=8.6.0)](https://nodejs.org/en/)
* [Yarn (>=1.0.0)](https://yarnpkg.com/en)

## Deployment

Not implemented. (CircleCI or Travis)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/xdevelsistemas/cpcon-api/tags). 

## Authors

* **Clayton Silva** - *xDevel* - [claytonsilva](https://github.com/claytonsilva)
* **David Vilaça** - *xDevel* - [davidpvilaca](https://github.com/davidpvilaca)
* **Douglas Lima** - *xDevel* - [douglasbolis](https://github.com/douglasbolis)

[![xDevel](xdevel.png)](http://xdevel.com.br)

Created and maintained by xDevel® 2018

## License

[MIT](LICENSE)
