interface ResponseMessage {
  type?: 'success' | 'error'
  success?: string
  error?: string
  message?: string
}

interface Success {
  success: string
}

export { ResponseMessage, Success }
