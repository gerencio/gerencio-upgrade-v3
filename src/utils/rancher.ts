import { config } from '../core'

export function getSource(): string {
  const urlLinux = 'https://releases.rancher.com/compose/' + config.rancher.RANCHER_COMPOSE_VERSION + '/rancher-compose-linux-amd64-' + config.rancher.RANCHER_COMPOSE_VERSION + '.tar.gz'
  const urlWindows = 'https://releases.rancher.com/compose/' + config.rancher.RANCHER_COMPOSE_VERSION + '/rancher-compose-windows-386-' + config.rancher.RANCHER_COMPOSE_VERSION + '.zip'
  const urlOSX = 'https://releases.rancher.com/compose/' + config.rancher.RANCHER_COMPOSE_VERSION + '/rancher-compose-darwin-amd64-' + config.rancher.RANCHER_COMPOSE_VERSION + '.tar.gz'
  let source = config.rancher.RANCHER_COMPOSE_VERSION ? urlLinux : config.rancher.RANCHER_COMPOSE_LINUX
  if (config.isWin) {
    source = config.rancher.RANCHER_COMPOSE_VERSION ? urlWindows : config.rancher.RANCHER_COMPOSE_WINDOWS
  }
  if (config.isOSX) {
    source = config.rancher.RANCHER_COMPOSE_VERSION ? urlOSX : config.rancher.RANCHER_COMPOSE_OSX
  }
  return source
}

export function getDir(): string {
  return config.rancher.RANCHER_COMPOSE_VERSION ? 'rancher-compose-' + config.rancher.RANCHER_COMPOSE_VERSION : 'rancher-compose-v0.12.5'
}
