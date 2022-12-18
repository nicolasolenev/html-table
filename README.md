## Конструктор html таблиц

`const table = new Table(header, options)`
_options = {headerTop, sorting}_
_headerTop: number - отступ (в px) фиксирвоанной шапки таблицы;_
_sorting: boolean - добавление функции сортировки таблицы по клику на заголовок столбца_

`const row = table.insert()`

`string_html_table = table.getTable()`

### Поддерживает следующие типы данных:

- number | number[]
- text | text[]
- file | file[]
- user | user[]
- link | link[]
- app | app[]

где:
link {
text: string; _// название ссылки_
href: string; _// ссылка_
}

### Создание экземпляра таблицы

Вызвать конструктор с параметром в виде массива объектов типа IHeader, где каждый объект - это столбец таблицы, где
name - ключ ячейки в далее создаваемой строке таблицы
caption - название столбца (заголовок)
width - (необязательное поле) ширина столбца в пикселях
type - (необязательное поле) тип данных. Обязательно указывать тип если это link, app
align - выравнивание в ячейке (left, center, right)

interface IHeader = {
name: string;
caption: string;
width?: number;
type?: 'number' | 'file' | 'user' | 'app' | 'link';
align?: string;
}

new Table(header: IHeader[]);

#### Добавление строки таблицы

_Предполагается, что есть массив данных, для которого нужно вызвать метод `forEach` или цикл `for of`_

for (const item of data) {
const row = table.insert(); _// создание строки_

for (const key in item) {
row[key] = item[key]
}
}

#### Получение элемента таблицы

const htmlTable = table.getTable(); _// получение DOM-элемента контейнера с таблицей_
_для непосредственного встраивания на страницу_

### Пример

const header = [
{name: 'name', caption: 'Наименование', width: 200},
{name: 'desc', caption: 'Описание', width: 300},
{name: 'date', caption: 'Дата', width: 100},
{name: 'user', caption: 'Пользователь', width: 200}
]

const data = [
{name: 'Организация', desc: 'Описание 1', date: '12.12.2022 08:20', user: {data:{__id: '42', __name: 'Якен Хгар'}}}
]

const table = new Table(header);

for (const item of data) {
const row = table.insert();

for (const key in item) {
row[key] = item[key]
}
}
