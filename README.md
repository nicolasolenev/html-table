\*\* html-table

Поддерживает следующие типы данных:

- number
- file
- user
- link
- массив строк/чисел
- строка (когда тип не задан)

Создание экземпляра таблицы

Вызвать конструктор с параметром в виде массива объектов типа IHeader, где каждый объект - это столбец таблицы, где
name - ключ ячейки в далее созданной строке таблицы
caption - название столбца (заголовок) таблицы
width - (необязательное поле) ширина столбца в пикселях (если не задана, то задается автоматически)
type - (необязательное поле) тип данных

interface IHeader = {
name: string;
caption: string;
width?: number;
type?: string;
}

new Table(header: IHeader[]);

Добавление строки таблицы

Предполагается, что есть массив данных, для которого нужно вызвать метод forEach или цикл for of

for (const item of data) {
const row = table.insert(); // создание строки;

for (const key in item) {
row[key] = item[key]
}
}

Получение элемента таблицы

const htmlTable = table.getTableNode(); // получение непосредственно DOM-элемента table
const htmlTable = table.getTable(); // получение DOM-элемента таблицы вложенного в обертки div,
для непосредственного встраивания на страницу

Если функция построения таблицы вызывается в виджете КОД, то необходимо из функции вернуть htmlTable.outerHTML;

Пример

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
