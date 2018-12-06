#!/usr/bin/env node
import * as commandLineArgs from 'command-line-args'
import * as commandLineUsage from 'command-line-usage'
import { environments } from './core'
import { deployUpgrade } from './deploy'
import { IDeployEnvs } from './interfaces'
import { GerencioUpgradeError, Logger } from './utils'

const project = require('../package.json')

const logger = new Logger()
let options: commandLineArgs.CommandLineOptions | null = null
const usage = commandLineUsage([
  {
    header: 'GERENCIO UPGRADE',
    content: `Version: ${project.version}`
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'service-name',
        typeLabel: '* {underline -n}',
        description: 'A gerencio service name'
      },
      {
        name: 'docker-image',
        typeLabel: '* {underline -d}',
        description: 'A docker image for upgrade'
      },
      {
        name: 'service-upgrade',
        typeLabel: '{underline -k}',
        description: 'A gerencio service name to upgrade (master of sidekicks)'
      },
      {
        name: 'timeout',
        typeLabel: '{underline -t}',
        description: 'Time limit too throw timeout error'
      },
      {
        name: 'gerenc-url',
        typeLabel: '{underline -u}',
        description: 'A gerencio url'
      },
      {
        name: 'gerenc-compose-url',
        typeLabel: '{underline -g}',
        description: 'A gerencio compose url'
      },
      {
        name: 'gerenc-stack',
        typeLabel: '{underline -c}',
        description: 'A gerencio url'
      },
      {
        name: 'gerenc-access-key',
        typeLabel: '{underline -a}',
        description: 'A gerenc.io access key'
      },
      {
        name: 'gerenc-secret-key',
        typeLabel: '{underline -s}',
        description: 'A gerenc.io secret key'
      },
      {
        name: 'version',
        typeLabel: '{underline -v}',
        description: 'Output current version'
      },
      {
        name: 'help',
        typeLabel: '{underline -h}',
        description: 'Show this usage guide.'
      }
    ]
  },
  {
    content: '* required options'
  },
  {
    header: 'Example usage',
    content: `
    $ gerencio-upgrade --service-name MyServiceName --docker-image myRespository/myProject:1.0.1
    `
  },
  {
    content: 'The gerenc.io options can be configured with environments variables. See documentation.'
  }
])

function main(): Promise<number> {

  options = commandLineArgs([
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'gerenc-secret-key', alias: 's', type: String },
    { name: 'gerenc-access-key', alias: 'a', type: String },
    { name: 'gerenc-stack', alias: 'c', type: String },
    { name: 'gerenc-url', alias: 'u', type: String },
    { name: 'gerenc-compose-url', alias: 'g', type: String },
    { name: 'timeout', alias: 't', type: String },
    { name: 'docker-image', alias: 'd', type: String },
    { name: 'service-name', alias: 'n', type: String },
    { name: 'service-upgrade', alias: 'k', type: String },
  ])

  // Check helper flag
  if (options.version) {
    logger.log(`Gerencio Upgrade v${project.version}`)
    return Promise.resolve(0)
  }

  // Check helper flag
  if (options.help) {
    console.log(usage)
    return Promise.resolve(0)
  }

  if (!options['service-name']) {
    throw new GerencioUpgradeError('Service name is required. Try with "--help".', 126)
  }

  if (!options['docker-image']) {
    throw new GerencioUpgradeError('Docker image is required. Try with "--help".', 126)
  }

  let serviceName: string = options['service-name']
  let newServiceImage: string = options['docker-image']
  let interval: number | undefined = options.timeout || 10000
  let serviceUpgrade: string | undefined = options['service-upgrade']

  let cliEnvs: IDeployEnvs = {
    gerencioAccessKey: options['gerenc-access-key'] || environments.gerencioAccessKey,
    gerencioSecretKey: options['gerenc-secret-key'] || environments.gerencioSecretKey,
    gerencioStack: options['gerenc-stack'] || environments.gerencioStack,
    gerencioUrl: options['gerenc-url'] || environments.gerencioUrl,
    gerencioComposeUrl: options['gerenc-compose-url'] || environments.gerencioComposeUrl
  }

  return deployUpgrade(serviceName, newServiceImage, interval, cliEnvs, serviceUpgrade)
    .then(
      () => 0,
      error => Promise.reject(GerencioUpgradeError.fromError(error))
    )
}

function onError(error: GerencioUpgradeError): void {
  logger.error(error)
  process.exit(error.code || 1)
}

try {
  main()
    .then(process.exit, onError)
    .catch(onError)
} catch (e) {
  onError(GerencioUpgradeError.fromError(e))
}
