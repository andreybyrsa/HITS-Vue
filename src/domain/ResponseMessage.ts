interface ResponseMessage {
  type?: 'success' | 'error'
  success?: string
  error?: string
  message?: string
}

export default ResponseMessage
