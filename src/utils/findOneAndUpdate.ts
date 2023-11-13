function findOneAndUpdate<DataType>(
  data: DataType[],
  newValue: DataType,
  params: { key: keyof DataType; value: DataType[keyof DataType] },
) {
  const existingDataIndex = data.findIndex(
    (value) => value[params.key] === params.value,
  )

  if (existingDataIndex !== -1) {
    data.splice(existingDataIndex, 1, newValue)

    return data[existingDataIndex]
  }
  data.push(newValue)

  return newValue
}

export default findOneAndUpdate
