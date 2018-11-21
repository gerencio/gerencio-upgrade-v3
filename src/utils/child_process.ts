import { exec } from 'child_process'

export const execPromise = (cmd: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        return reject(err)
      }
      return resolve(stdout)
    })
  })
}
