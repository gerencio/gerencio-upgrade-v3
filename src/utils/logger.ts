export class Logger {
  info(...args: any[]): void {
    return console.info(...args)
  }
  log(...args: any[]): void {
    return console.log(...args)
  }
  error(...args: any[]): void {
    args.forEach(err => {
      if ( (err instanceof Error) && (typeof (err as any).code === 'number') ) {
        console.error(err.message)
        console.info(err.stack)
        console.error(`Error code: ${(err as any).code}`)
        return
      }
      console.error(err)
    })
  }
  warning(...args: any[]): void {
    return console.warn(...args)
  }
}
