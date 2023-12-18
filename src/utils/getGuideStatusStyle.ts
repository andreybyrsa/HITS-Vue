import { MarketStatus } from '@Domain/Market'
function getStatusStyle(status: MarketStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']
  if (status === 'NEW') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }
  if (status === 'DONE') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
  if (status === 'ACTIVE') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}
export default getStatusStyle
