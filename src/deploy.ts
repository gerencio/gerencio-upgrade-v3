import * as download from 'download'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as request from 'request'
import * as util from 'util'
import { config, environments as coreEnvs } from './core'
import { IDeployEnvs } from './interfaces'
import { execPromise, filterKeys, getDir, getSource, Logger } from './utils'

const writeYaml = require('write-yaml')
const fss = require('fs-sync')
const unzip = require('unzip2')
const logger = new Logger()

export function deployUpgrade(serviceName: string, newServiceImage: string, interval = 15000, deployEnvs: IDeployEnvs = coreEnvs, serviceUpgrade?: string): Promise<void> {

  function preDeploy(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fse.removeSync('docker-compose.yml')
        fse.removeSync('rancher-compose.yml')

        const url = deployEnvs.gerencioComposeUrl
        const username = deployEnvs.gerencioAccessKey
        const password = deployEnvs.gerencioSecretKey

        logger.log('Downloading rancher compose config')
        logger.log(url)

        request.get(url).auth(username, password, true)
          .pipe(unzip.Extract({ path: '.' }))
          .on('close', () => resolve(deploy()))
          .on('error', logger.error)
      } catch (e) {
        logger.info('Initialization failed')
        reject(e)
      }
    })
  }

  async function deploy() {
    logger.info('DEPLOYMENT STARTING')
    try {
      const sourceComposeFile = 'docker-compose.yml'
      const rancherComposeFile = 'rancher-compose.yml'

      logger.log('Loading %s', sourceComposeFile)
      const yamlDoc = yaml.safeLoad(fs.readFileSync(sourceComposeFile, 'utf8')) as { [key: string]: any }

      logger.log('Searching for service definition: %s', serviceName)
      let currentServiceEntry: string | null = null
      let currentServiceUpgrade: string | null = null

      if (Object.keys(yamlDoc).filter(d => d === 'services').length) {
        // Docker-compose v2
        const expression = util.format('^%s$', serviceName)
        const matches = filterKeys(yamlDoc['services'], expression)

        if (serviceUpgrade) {
          const matchesUpgrade = filterKeys(yamlDoc['services'], `^${serviceUpgrade}$`)
          if (matchesUpgrade.length === 0) {
            throw new Error(util.format('Could not find any services matching name: %s', serviceUpgrade))
          } else {
            currentServiceUpgrade = matchesUpgrade[0]
          }
        }

        if (matches.length === 0) {
          throw new Error(util.format('Could not find any services matching name: %s', serviceName))
        }

        if (matches.length === 1) {
          currentServiceEntry = matches[0]
        } else {
          logger.log("multiple service entries found that match: '%s': %s ", serviceName, matches)
          let maxVersion = 0
          matches.forEach(entry => {
            const entryVersion = Number(entry.split('-').pop())
            if (entryVersion > maxVersion) {
              maxVersion = entryVersion
              currentServiceEntry = entry
            }
          })
        }
        if (!currentServiceEntry) {
          throw new Error('Could not find a matching service entry, giving up')
        }

        logger.log('Using service entry: ' + currentServiceEntry)

        // TODO: check the docker registry to see if the image actually exists
        const currentServiceElement = yamlDoc['services'][currentServiceEntry]
        logger.log(currentServiceElement)
        // clone the service element
        const newServiceElement = (JSON.parse(JSON.stringify(currentServiceElement)))
        newServiceElement.image = newServiceImage
        yamlDoc['services'][currentServiceEntry] = newServiceElement
      } else {
        // Old Model docker-compose
        const v1Expression = util.format('^%s$', serviceName)
        const v1Matches = filterKeys(yamlDoc, v1Expression)
        if (v1Matches.length === 0) {
          throw new Error(util.format('Could not find any services matching name: %s', serviceName))
        }
        if (v1Matches.length === 1) {
          currentServiceEntry = v1Matches[0]
        } else {
          logger.log("multiple service entries found that match: '%s': %s ", serviceName, v1Matches)
          let v1MaxVersion = 0
          v1Matches.forEach(entry => {
            const entryVersion = Number(entry.split('-').pop())
            if (entryVersion > v1MaxVersion) {
              v1MaxVersion = entryVersion
              currentServiceEntry = entry
            }
          })
        }
        if (currentServiceEntry === null) {
          throw new Error('Could not find a matching service entry, giving up')
        }
        logger.log('Using service entry: ' + currentServiceEntry)

        // TODO: check the docker registry to see if the image actually exists
        const v1CurrentServiceElement = yamlDoc[currentServiceEntry]
        logger.log(v1CurrentServiceElement)
        // clone the service element
        const v1newServiceElement = (JSON.parse(JSON.stringify(v1CurrentServiceElement)))
        v1newServiceElement.image = newServiceImage
        yamlDoc[currentServiceEntry] = v1newServiceElement
      }

      const targetFile = sourceComposeFile
      logger.log('writing modified YAML file out to %s', targetFile)
      writeYaml.sync(targetFile, yamlDoc)
      logger.log('Successfully wrote modified YAML file out to %s', targetFile)
      const args = util.format('--url %s --access-key %s --secret-key %s -p %s --file %s --rancher-file %s up -d --batch-size 1 --interval %s --confirm-upgrade  --pull  --force-upgrade %s',
        deployEnvs.gerencioUrl,
        deployEnvs.gerencioAccessKey,
        deployEnvs.gerencioSecretKey,
        deployEnvs.gerencioStack,
        targetFile,
        rancherComposeFile,
        interval,
        currentServiceUpgrade || currentServiceEntry
      )

      const source = getSource()
      await download(source, '.', { extract: true })
      logger.log('Rancher-compose downloaded')
      let cmd: string | null = null
      if (config.isWin) {
        logger.log('Detected environment: Windows')
        logger.log('Copying rancher-compose.exe to working directory...')
        const composeFilePath = path.join('./', getDir(), 'rancher-compose.exe')
        fss.copy(composeFilePath, './rancher-compose.exe')
        cmd = 'rancher-compose.exe '
      } else if (config.isOSX) {
        logger.log('Detected environment: OSX')
        cmd = getDir() + '/rancher-compose '
      } else {
        logger.log('Detected environment: Linux')
        cmd = getDir() + '/rancher-compose '
      }
      logger.log('Running:\n' + cmd + args.replace(/\-\-access\-key.*\s\-p/, '--access-key ###### --secret-key ###### -p'))
      const output = await execPromise(cmd + args)
      logger.log(output)
    }
    catch (e) {
      logger.info('DEPLOYMENT FAILED')
      logger.error(e)
      throw new Error('DEPLOYMENT FAILED: ' + String(e))
    }
  }

  return preDeploy()

}
