import { ref } from 'vue'

const isSorted = ref<boolean>(false)

function mutableSort<DataType>(
  data: DataType[],
  getCompariedValue: (data: DataType) => number | null,
) {
  console.log(isSorted.value)
  data.sort((data1, data2) => {
    const comparingValue1 = getCompariedValue(data1)
    const comparingValue2 = getCompariedValue(data2)

    if (comparingValue1 && comparingValue2) {
      if (isSorted.value) {
        return comparingValue1 - comparingValue2
      } else {
        return comparingValue2 - comparingValue1
      }
    } else {
      return -1
    }
  })
  isSorted.value = !isSorted.value
}

export default mutableSort
