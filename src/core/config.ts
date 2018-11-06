const RANCHER_COMPOSE_LINUX = 'https://releases.rancher.com/compose/beta/latest/rancher-compose-linux-amd64.tar.gz'
const RANCHER_COMPOSE_WINDOWS = 'https://releases.rancher.com/compose/beta/latest/rancher-compose-windows-386.zip'
const RANCHER_COMPOSE_OSX = 'https://releases.rancher.com/compose/beta/latest/rancher-compose-darwin-amd64.tar.gz'
const RANCHER_COMPOSE_VERSION = 'v0.12.5'

export const config = {
  rancher: {
    RANCHER_COMPOSE_LINUX,
    RANCHER_COMPOSE_WINDOWS,
    RANCHER_COMPOSE_OSX,
    RANCHER_COMPOSE_VERSION
  },
  isWin: /^win/.test(process.platform),
  isOSX: /^darwin/.test(process.platform)
}
