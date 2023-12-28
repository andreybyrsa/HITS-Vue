# HITS-Vue

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# defineAxios - параллельная разработка

### Для чего нужна функция

defineAxios - кастомная утилита над сервисами проекта Vue, которая обеспечивает
параллельную разработку между фронтенд и бекенд офисами.

При разработке интерфейса возвращаются подстановочные данные, которыми мы можем
управлятя.

### Использование

В файле main.ts переменной MODE необходимо присвоить режим разработки:

```ts
const MODE: 'DEVELOPMENT' | 'PRODUCTION' = 'DEVELOPMENT'
```

Засчет MODE переменной меняется режим разработки, и подстановочные данные меняются на
API вашего сервера и наоборот.

В файле getMocks.ts необходимо написать те подстановочные данные, которыми мы хотим
управлять:

```ts
import YourType from '/path/to-your-type'

interface Mocks {
  data: YourType[]
}

function getMocks(): Mocks {
  const data: YourType[] = [
    {
      id: '0',
      number: 1,
    },
    {
      id: '1',
      number: 2,
    },
  ]

  return { data }
}
```

В сервисе, который Вы разрабатываете, необходимо проинициализировать утилиту
defineAxios():

```ts
import defineAxios from '/path/to-utils'
import getMocks from 'path/to-get-mocks'

const yourServiceAxios = defineAxios(getMocks().yourMocks)
```

Утилита definAxios поддерживает все основные методы HTTP протокола - GET, POST, PUT,
PUTNOREQUESTBODY, DELETE.

Засчет перегрузок данных методов можно передавать разную параметризацию - типы данных
и конфиги.

### Пример использования:

```ts
interface AxiosMockConfig<YourTypeParams, ResponseMocksType> {
  params?: YourTypeParams
  requestData?: YourTypeParams
  responseData?: ResponseMocksType
  formatter?: (data: YourTypeParams[]) => ResponseMocksType
}

yourServiceAxios.get(endPoint: string, config?: AxiosRequestConfig, mockConfig: AxiosMockConfig)
```

Параметризацию запроса осуществляет mockConfig:

- params: это атрибуты Вашего объекта, по которым осуществляется поиск объекта из
  подстановочных данных. Если params не переданы, то возращаются все данные.

- requestData: относится к PUT запросам, когда необходимо поменять отдельные атрибуты
  объекта. Также можно передавать весь объект сразу, без параметра requestData.

- responseData: в разных ситуациях мы ожидаем разные типы данных, поэтому
  responseData отвечает за возвращаемые данные и их тип. Если параметр не передан, то
  возвращаются отправленные данные.

- formatter: относится к GET запросам, когда необходимо запрашиваемые данные
  преобразовать перед принятем. Данный параметр - функция, которая принимает аргумент
  в виде всего массива данных и возвращает их преобразованные данные. Возможно
  использование замыкания.

### Валидация

#### Валидация нужна для проверки условий, которые вы можете задать сами: пустое поле или нет, допустимое количество символов, сами символы и т.д.

#### Рассмотрим ипользование валидации на более конкретном примере:

#### Валидация применяется к форме, поэтому нужно использовать useForm, который мы импортируем

```
import { useForm } from 'vee-validate'
```

#### useForm - это хук из библиотеки форм VeeValidate, который предоставляет функциональность управления формами и валидации данных

#### Используем useForm в script. В данном случае мы передаем в него объект с настройками формы

```
const { errors, setValues, handleSubmit, values } = useForm<UserGroupData>({})
    //в {} деструктурирующее присваивание, которое извлекает соответствующие значения из объекта
    //в <> указываем тип формы, которую будем валидировать


```

#### В ts файте типы UserGroupData выглядят так:

```
    interface UserGroupData {
        id: string
        name: string
        users: User[]
    }
```

#### validationSchema - это свойство объекта, которое определяет схему проверки валидации для каждого поля формы

```
validationSchema: {
    name: (value: string) => value?.length > 0 || 'Поле не заполнено', //проверяем поле name, если оно не заполнено, выводим текст
    users: (value: User[]) => value?.length > 0 || 'Выберите пользователя', //проверяем поле users, если массив пуст, выводим текст
  },
```

#### Условие для проверки для каждого поля в общем виде выглядит как:

```
validationSchema: {
    название_поля: (value: тип) => проверка(с использованием value) || если не прошло проверку,
  },
```

#### После выполнения этой строки кода, у нас появятся четыре переменные: errors, setValues, handleSubmit и values. errors содержит текущие ошибки валидации формы, setValues - функция для установки значений полей формы, handleSubmit - функция, которая будет вызываться при отправке формы, и values - объект, содержащий текущие значения полей формы

### useField и useFields

#### useField и useFields — это две кастомные React хуки, которые помогают управлять формами и их валидацией. Они представляют собой полезные инструменты для обработки входных данных пользователей и предоставления обратной связи относительно правильности заполнения формы

#### Для использования их нужно испортировать

```
import { useField, useFields } from 'react-hook-form'
```

### Использование useField

#### Функция useField позволяет управлять отдельным полем ввода в форме. Она предоставляет значения поля, а также сообщение об ошибке, если поле не прошло валидацию

#### Пример:

```
const { value, errorMessage } = useField(props.name, props.validation, {
  validateOnValueUpdate: props.validateOnUpdate ?? false,
  validateOnMount: false,
  syncVModel: true,
})
```

#### Параметры name и validation являются обязательными. name представляет собой имя поля ввода, а validation — функцию валидации для данного поля

### Использование useFields

#### Функция useFields позволяет управлять несколькими полями ввода одновременно. Она возвращает объект, содержащий значения и сообщения об ошибках для каждого поля

#### Пример

```
const fields = useFields(fieldsArray, formOptions)
```

#### Первым аргументом функции useFields является массив объектов полей ввода fieldsArray, а вторым аргументом — объект настроек formOptions

#### В fieldsArray вы должны предоставить массив объектов с информацией о каждом поле ввода. Каждый объект должен содержать следующие свойства:

#### -name (тип данных: string): имя поля ввода.

#### -validation (тип данных: function): функция валидации для данного поля.

#### formOptions является опциональным объектом, который позволяет настроить поведение хука useFields

#### Дополненная версия будет выглядеть так:

```
const fieldsArray = [
  { name: 'firstName', validation: (value) => value !== '' },
  { name: 'lastName', validation: (value) => value.length >= 5 },
  { name: 'email', validation: (value) => /^\S+@\S+\.\S+$/.test(value) },
];

const formOptions = {
  validateOnValueUpdate: true,
  validateOnMount: true,
};

const fields = useFields(fieldsArray, formOptions)
```

### Директивы

### v-model

#### Используется для создания двусторонней привязки данных между дочерним и родительским компонентами. Для его использования необходимо в дочернем компоненте проинициализировать данное реактивное значение:

```
const myValue = defineModel<ValueType>('valueName', { ...options })
```

#### Также возможно использование несколько v-model в одном компоненте:

```
v-model:name1=""
v-model:name2=""
```

#### Пример:

```
<AddUsersGroup
  :isOpened="isOpenedAddGroup"
  :currentAddUsersGroup="currentAddUsersGroup"
  @close-modal="closeAddGroupModal"
  :usersarray="usersarray"
  v-model="usersGroup"
>
```

#### В этом примере компонент AddUsersGroup содержит элементы формы для добавления пользователей. Директива v-model связывает свойство usersGroup с соответствующим элементом формы внутри компонента. В результате, значения, введенные пользователем в форму, автоматически синхронизируются с переменной usersGroup

### v-tooltip

#### Директива v-tooltip используется для добавления всплывающей подсказки к элементу. При наведении курсора на элемент появляется всплывающее окно с заданным текстом

#### Пример:

```
<script>
function getCurrentTooltip(select: PreAssessmentSelect) {
  const selectValue = props.idea[select.name]
  if (selectValue) {
    return select.options.find((option) => option.value === selectValue)?.label
  }
}
</script>

<template>
<Select
  :name="select.name"
  validate-on-update
  :label="select.label"
  :options="select.options"
  v-tooltip="getCurrentTooltip(select)"
  placeholder="Выберите значение"
></Select>
</template>
```

#### Здесь использована директива v-tooltip с функцией getCurrentTooltip, чтобы отобразить подсказку в компоненте Select. Функция getCurrentTooltip принимает объект select и возвращает текст подсказки для выбранного значения из списка опций

#### Директива v-tooltip может быть настроена с помощью передачи дополнительных параметров. Например, можно изменить позицию всплывающей подсказки, использовать другие стили или настроить время задержки перед отображением

### v-collapse

#### Директива v-collapse используется для сворачивания и раскрытия содержимого компонента или элемента. Когда элемент активируется (например, по клику), содержимое сворачивается или разворачивается с использованием анимации

#### Пример:

```
<Button
  :class-name="errors.newRoles ? 'btn-outline-danger px-2 py-0' : 'px-2 py-0'"
  append-icon-name="bi bi-chevron-down"
  v-collapse="'editUserModalCollapse'"
>
  Роли
</Button>

<Collapse id="editUserModalCollapse" class-name="w-100">
  <template v-for="role in availableRoles.roles" :key="role">
    <Checkbox
      name="newRoles"
      class-name="drop-down-item"
      validate-on-update
      :label="availableRoles.translatedRoles[role]"
      :value="role"
    />
  </template>
</Collapse>
```

#### В примере используется директива v-collapse для сворачивания и разворачивания содержимого компонента Collapse. Кнопка Button с иконкой bi-chevron-down вызывает сворачивание или разворачивание содержимого Collapse с помощью директивы v-collapse с идентификатором editUserModalCollapse

#### Директива v-collapse может быть настроена с помощью передачи дополнительных параметров. Например, можно настроить время анимации или указать дополнительные классы стилей

### v-dropdown

#### Директива v-dropdown используется для создания выпадающего меню или списка с помощью кнопки или другого элемента. При активации элемента, связанного с директивой v-dropdown, отображается выпадающий список с опциями или содержимым

#### Пример:

```
<Button
  class-name="btn-primary fs-3"
  prepend-icon-name="bi bi-list"
  v-dropdown="skill-controller-${item.id}"
></Button>
```

#### Здесь использована директива v-dropdown на кнопке Button. Кнопка будет связана с выпадающим списком или меню, и при активации кнопки будет отображаться выпадающий список или содержимое

#### Директива v-dropdown может быть настроена с помощью передачи дополнительных параметров. Например, можно указать, какое содержимое должно быть отображено внутри выпадающего списка, настроить позицию меню или задать свои стили

### Компонент таблицы

#### Как и все компоненты, он имеет два файла: Table.ts и Table.vue

### Table.ts

### Файл Table.ts содержит интерфейсы и типы TypeScript, связанные с компонентом таблицы

#### Интерфейс TableColumn:

```
interface TableColumn {
  key: string
  label: string
  icon?: string
  className?: string
  click?: () => void
  getStyle?: (value: any) => string
  getFormat?: (value: any) => string | number | undefined
}
```

#### Интерфейс TableColumn представляет столбец в таблице. Он имеет следующие свойства:

#### - key: строка, представляющая ключ или идентификатор столбца

#### - label: строка, представляющая название или заголовок столбца

#### - icon (необязательно): строка, представляющая иконку столбца

#### - className (необязательно): строка, представляющая CSS-класс столбца

#### - click (необязательно): функция, которая вызывается при клике на столбец

#### - getStyle (необязательно): функция, которая получает значение и возвращает строку, представляющую CSS-стиль для ячейки в столбце

#### - getFormat (необязательно): функция, которая получает значение и возвращает форматированное значение для ячейки в столбце

### Интерфейс TableProps:

```
interface TableProps {
  columns: TableColumn[]
  data: any[]
  searchValue?: string
}
```

#### Интерфейс TableProps представляет свойства или входные данные для компонента таблицы. Он имеет следующие свойства:

#### - columns: массив объектов типа TableColumn, представляющих столбцы в таблице

#### - data: массив любого типа, представляющий строки данных для таблицы

#### - searchValue (необязательно): строка, представляющая значение поиска для фильтрации строк данных

#### Инструкция export в конце файла экспортирует типы TableProps и TableColumn для использования в других модулях

### Table.vue

#### Файл Table.vue содержит шаблон и логику реализации компонента таблицы

#### Свойства и данные:

```
const props = defineProps<TableProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const searchedValue = computed(() => {
  return props.data.filter((element) => {
    const elementData = element.name.toLowerCase().trim()
    const currentSearchedValue = props.searchValue?.toLowerCase().trim()

    const isIncludesSearcheValue = elementData.includes(currentSearchedValue)

    return isIncludesSearcheValue
  })
})
```

#### - props определяется как свойства компонента с использованием defineProps<TableProps>()

#### - userStore определяется с использованием функции useUserStore()

#### - user получается из storeToRefs(userStore)

#### - searchedValue - это вычисляемое свойство, которое фильтрует массив props.data на основе props.searchValue и возвращает отфильтрованный результат

#### Компонент также определяет две вспомогательные функции: getCellStyle(styleFunction?, value?) и checkMark(row: Idea)

```
function getCellStyle(styleFunction?: (value: any) => string, value?: any) {
  let CellClass = 'table__row-cell col '
  if (styleFunction) {
    CellClass += styleFunction(value)
  }
  return CellClass
}

function checkMark(row: Idea) {
  const currentRole = user.value?.role
  const currentStatusIdea = row.status
  const currentInitiatorIdea = row.initiator
  const currentEmail = user.value?.email
  return currentRole == 'INITIATOR' &&
    (currentStatusIdea == 'NEW' || currentStatusIdea == 'ON_EDITING') &&
    currentInitiatorIdea == currentEmail
    ? true
    : currentRole == 'PROJECT_OFFICE' && currentStatusIdea == 'ON_APPROVAL'
    ? true
    : currentRole == 'EXPERT' && currentStatusIdea == 'ON_CONFIRMATION'
    ? true
    : false
}
```

#### Функция getCellStyle принимает необязательные параметры styleFunction и value и возвращает строку, представляющую CSS-класс для ячейки таблицы. Если указана функция styleFunction, то она добавляется к классу

#### Функция checkMark принимает аргумент row типа Idea и проверяет различные условия для определения, должна ли быть отображена отметка. Она использует объект user, полученный из хранилища пользователей, и сравнивает роль пользователя, статус инициативы, инициатора идеи и электронную почту пользователя, чтобы определить возвращаемое значение

#### Секция template компонента определяет HTML-структуру таблицы с использованием директив и интерполяций Vue. Она выполняет итерацию по столбцам и строкам данных для динамического создания ячеек таблицы
