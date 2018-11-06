import * as commandLineArgs from 'command-line-args'
import * as commandLineUsage from 'command-line-usage'
import { environments } from './core'
import { deployUpgrade } from './deploy'
import { IDeployEnvs } from './interfaces'
import { Logger } from './utils'

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
    $ gerencio-upgrade $GERENCIO_SERVICE_NAME myRespository/myProject:1.0.1
    `
  },
  {
    content: 'The gerencio and aws options can be configured with environments variables. See documentation.'
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
    { name: 'timeout', alias: 't', type: String },
    { name: 'docker-image', alias: 'd', type: String },
    { name: 'service-name', alias: 'n', type: String },
  ])

  // Check helper flag
  if (options.version) {
    logger.log(`Gerencio Upgrade v${project.version}`)
    process.exit(0)
  }

  // Check helper flag
  if (options.help) {
    console.log(usage)
    process.exit(0)
  }

  if (!options['service-name']) {
    throw new Error('Service name is required. Try with "--help".')
  }

  if (!options['docker-image']) {
    throw new Error('Docker image is required. Try with "--help".')
  }

  let serviceName: string = options['service-name']
  let newServiceImage: string = options['docker-image']
  let interval: number | undefined = options.timeout

  let cliEnvs: IDeployEnvs = {
    gerencioAccessKey: options['gerenc-access-key'] || environments.gerencioAccessKey,
    gerencioSecretKey: options['gerenc-secret-key'] || environments.gerencioSecretKey,
    gerencioStack: options['gerenc-stack'] || environments.gerencioStack,
    gerencioUrl: options['gerenc-url'] || environments.gerencioUrl
  }

  return deployUpgrade(serviceName, newServiceImage, interval, cliEnvs)
    .then(
      () => 0,
      error => Promise.reject(error)
    )
}

function onError(error: any): void {
  if (options !== null && (typeof error === 'string' || error.message)) {
    logger.error(error.message || error)
    return
  }
  console.log(error)
}

try {
  main()
    .then(process.exit, onError)
    .catch(onError)
} catch (e) {
  onError(e)
}
