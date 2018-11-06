export class Logger {
  info(...args: any[]): void {
    return console.info(...args)
  }
  log(...args: any[]): void {
    return console.log(...args)
  }
  error(...args: any[]): void {
    return console.error(...args)
  }
  warning(...args: any[]): void {
    return console.warn(...args)
  }
}
