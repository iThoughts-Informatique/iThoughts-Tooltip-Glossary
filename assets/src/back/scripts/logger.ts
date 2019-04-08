import { NAMESPACE } from "./settings";

export const log = console.log.bind(console, `[${NAMESPACE}]:`);
export const debug = console.debug.bind(console, `[${NAMESPACE}]:`);
export const info = console.info.bind(console, `[${NAMESPACE}]:`);
export const warn = console.warn.bind(console, `[${NAMESPACE}]:`);
export const error = console.error.bind(console, `[${NAMESPACE}]:`);
