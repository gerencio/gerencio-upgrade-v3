/**
 * @description Generic error class for throws
 * @author David Vilaça
 * @date 2018-12-05
 * @export
 * @class GerencioUpgradeError
 * @extends {Error}
 */
export class GerencioUpgradeError extends Error {

  /**
   * @description Factory: get instance from another errors
   * @author David Vilaça
   * @date 2018-12-05
   * @static
   * @param {*} e
   * @param {number} [code=1]
   * @returns {GerencioUpgradeError}
   * @memberof GerencioUpgradeError
   */
  public static fromError(e: any, code: number = 1): GerencioUpgradeError {
    const error = new GerencioUpgradeError(e.message ? e.message : '', code)
    if (e.name) {
      error.name = e.name
    }
    if (e.stack) {
      error.stack = e.stack
    }
    return error
  }

  /**
   * Creates an instance of GerencioUpgradeError.
   * @author David Vilaça
   * @date 2018-12-05
   * @param {string} message
   * @param {number} [code=1]
   * @memberof GerencioUpgradeError
   */
  constructor (message: string, public readonly code: number = 1) {
    super(message)
  }
}
