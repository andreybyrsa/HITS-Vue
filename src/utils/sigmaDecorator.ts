export const TryCatch = (
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
) => {
  const method = descriptor.value
  descriptor.value = async function (...args: any[]) {
    try {
      const result = await method?.apply(this, args)
      return result
    } catch (error) {
      return error
    }
  }
}
