import { config } from 'dotenv'

config()

export const environments = {
  gerencioUrl: String(process.env.GERENCIO_URL),
  gerencioComposeUrl: String(process.env.GERENCIO_COMPOSE_URL),
  gerencioAccessKey: String(process.env.GERENCIO_ACCESS_KEY),
  gerencioSecretKey: String(process.env.GERENCIO_SECRET_KEY),
  gerencioStack: String(process.env.GERENCIO_STACK)
}
