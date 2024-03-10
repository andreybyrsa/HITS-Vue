export function getAbortedSignal(checkForAbort: () => boolean) {
  const controller = new AbortController()

  if (checkForAbort()) {
    controller.abort()
  }

  return controller.signal
}
