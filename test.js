const css = `.custom-table-wrapper {
  margin: 12px 0 20px;
}
.custom-table {
  border: 0.5px solid #d9d9d9;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
  overflow-wrap: break-word;
}
.custom-table thead {
  z-index: 100;
  position: sticky;
  background: #f0f6fb;
}
.custom-table tbody tr:nth-child(even) {
  background: #c7c7c726;
}
.custom-table th {
  position: relative;
}
.custom-table th,
.custom-table td {
  border: 0.5px solid #d9d9d9;
  padding: 4px;
}
.custom-table td.custom-table__td-number {
  text-align: right;
  white-space: nowrap;
}
.custom-table tr.custom-table__tr_dark {
  background: #c7c7c726;
}
.custom-table a {
  display: block;
  margin: 5px 0;
}
.custom-table__sort:after {
  position: absolute;
  top: 0px;
  right: 2px;
  font-size: 10px;
  color: #506f9a;
  content: '▲';
}
.custom-table__sort_up:after {
  transform: rotate(180deg);
}
@media (max-width: 850px) {
  .custom-table-wrapper {
    overflow: scroll;
  }
  .custom-table {
    width: auto;
    min-width: 830px;
  }
}`;

class Table {
  tHead = this.createNode('thead');
  tBody = this.createNode('tbody');
  sortingCount = 300;

  constructor(headerData, { headerTop, sorting } = {}) {
    if (!headerData) {
      console.error(
        'error in Table constructor: need header to initialize table'
      );
      return;
    }

    this.cellData = headerData;

    const headerRow = this.createNode('tr');

    for (const thData of headerData) {
      const th = this.createNode('th');
      th.dataset.name = thData.name;
      th.textContent = thData.caption;
      th.style.width = `${thData.width}px`;
      headerRow.append(th);
    }

    this.tHead.style.top = `${headerTop ?? 0}px`;
    this.tHead.append(headerRow);
    this.tableId = 'id' + Math.random().toString(16).slice(2);

    sorting && this.addSorting();
  }

  createNode(name, { className, id } = {}) {
    const node = document.createElement(name);
    className && (node.className = className);
    id && (node.id = id);
    return node;
  }

  createLink({ text, href, blank }) {
    if (!text && !href) return;
    const link = document.createElement('a');
    link.textContent = text ?? window.location.origin + href;
    href && link.setAttribute('href', href);
    blank && link.setAttribute('target', '_blank');
    return link;
  }

  insert() {
    const tr = this.createNode('tr');
    const row = {};

    for (const { name, type, align } of this.cellData) {
      const td = this.createNode('td');
      if (align === 'left' || align === 'right') {
        td.style.textAlign = align;
      }

      row[name] = {};

      const createLink = this.createLink;
      const getValues = (value) => [value].flat(1);

      Object.defineProperty(row, name, {
        set(value) {
          const values = getValues(value);
          const code = values[0]?.code;
          const kind = values[0]?.kind;

          if (type === 'number') {
            td.className = 'custom-table__td-number';
            values.forEach((item) => {
              if (isNaN(item) || item === null) {
                console.error('error in type "number": isNaN or null', item);
                return;
              }
              try {
                const numb = new Intl.NumberFormat('ru-RU', {
                  maximumFractionDigits: 2,
                }).format(item);

                const div = document.createElement('div');
                div.textContent = numb;
                td.append(div);
              } catch (e) {
                console.error('error in type "number"', e);
                td.textContent = item ?? '';
              }
            });
            return;
          }

          if (type === 'file' || code === 'disk_files' || kind === 'file') {
            try {
              values.forEach((file) => {
                if (!file) return;
                const link = createLink({
                  text: file.data?.__name,
                  href: file.data?.__id && `(p:preview/${file.data?.__id})`,
                });
                link && td.append(link);
              });
            } catch (e) {
              console.error('error in type "file"', e);
            } finally {
              return;
            }
          }

          if (type === 'user' || code === 'users') {
            try {
              values.forEach((user) => {
                if (!user) return;
                const link = createLink({
                  text: user.data?.__name,
                  href: user.data?.__id && `/profile/${user.data?.__id}`,
                  blank: true,
                });
                link && td.append(link);
              });
            } catch (e) {
              console.error('error in type "user"', e);
            } finally {
              return;
            }
          }

          if (type === 'app' || kind === 'application') {
            try {
              values.forEach((app) => {
                if (!app) return;
                const link = createLink({
                  text: app.data?.__name,
                  href: `(p:item/${app.namespace}/${app.code}/${app.data?.__id})`,
                });
                td.append(link);
              });
            } catch (e) {
              console.error('error in type "app"', e);
            } finally {
              return;
            }
          }

          if (type === 'link') {
            try {
              values.forEach((item) => {
                if (!item) return;
                const link = createLink({
                  text: item.text,
                  href: item.href,
                  blank: true,
                });
                link && td.append(link);
              });
            } catch (e) {
              console.error('error in type "link"', e);
            } finally {
              return;
            }
          }

          try {
            values.forEach((item) => {
              if (item === undefined || item === null) return;
              const div = document.createElement('div');
              div.append(item);
              td.append(div);
            });
          } catch (e) {
            console.error('error in "unknown" type', e);
          } finally {
            return;
          }
        },
      });

      tr.append(td);
    }

    this.tBody.append(tr);
    return row;
  }

  getTableNode() {
    const table = this.createNode('table', {
      className: 'custom-table',
      id: this.tableId,
    });
    table.append(this.tHead, this.tBody);
    return table;
  }

  getTable() {
    const container = this.createNode('div');
    container.style.width = '100%';
    container.style.position = 'relative';
    const style = this.createNode('style');
    style.appendChild(document.createTextNode(css));
    const wrapper = this.createNode('div', {
      className: 'custom-table-wrapper',
    });
    wrapper.append(this.getTableNode());
    container.append(style, wrapper);
    return container.outerHTML;
  }

  sortTable(table, col, reverse) {
    const tb = table.tBodies[0];
    const trs = [...tb.rows];
    reverse = -(+reverse || -1);
    trs.sort(
      (a, b) =>
        reverse *
        a.cells[col].textContent
          .trim()
          .localeCompare(b.cells[col].textContent.trim())
    );
    trs.forEach((tr) => tb.append(tr));
  }

  addSorting() {
    const table = document.getElementById(this.tableId);
    if (!table) {
      --this.sortingCount > 0 &&
        window.setTimeout(() => this.addSorting(), 800);
      return;
    }
    const tHead = table?.querySelector('thead');
    const ths = [...table?.querySelectorAll('th')];
    const columns = this.cellData;
    tHead.style.cursor = 'pointer';
    tHead.addEventListener('click', (e) => {
      const columnIndex = columns.findIndex(
        (col) => col.name === e.target.dataset.name
      );
      const th = e.target;
      if (th.tagName !== 'TH') {
        return;
      }
      const isSorted = th.classList.contains('custom-table__sort_up');
      ths.forEach((th) => th.removeAttribute('class'));
      th.classList.add('custom-table__sort');
      if (isSorted) {
        this.sortTable(table, columnIndex, true);
        return;
      }
      th.classList.add('custom-table__sort_up');
      this.sortTable(table, columnIndex);
    });
  }
}

const mockData = {
  header: [
    { name: 'name', caption: 'Наименование', width: 200, align: 'left' },
    { name: 'desc', caption: 'Описание', width: 300, align: 'right' },
    { name: 'file', caption: 'Файл', width: 150, type: 'file' },
    { name: 'data_arr', caption: 'Массив' },
    { name: 'numb', caption: 'Число', type: 'number' },
    { name: 'date', caption: 'Дата', width: 100 },
    { name: 'user', caption: 'Пользователь', width: 200 },
  ],
  rows: [
    {
      name: ['Компания 1', 'Компания 1.1'],
      desc: 'Описание Компании 1',
      file: { data: { __id: '#', __name: 'file 1' } },
      date: '12.12.2022',
      user: { code: 'users', data: { __id: '#', __name: 'Николай Петров' } },
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.2, '0123.000'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.2, '0123'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.2, '0123'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.2, '0123'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.2, '0123'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'С компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.2, '0123'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: [
        { data: { __id: '#', __name: 'file 2' } },
        undefined,
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
        { data: { __id: '#', __name: 'file 2.2' } },
      ],
      numb: [13242945.289987, '0123'],
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: [
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
        { code: 'users', data: { __id: '#', __name: 'Андрей Сидоров' } },
      ],
    },
    {
      name: 'А компания 3',
      desc: 'Описание Компании 3',
      file: [{ data: { __id: '#', __name: 'file 3' } }],
      numb: 132423.121313,
      date: '14.12.2022',
      user: [
        { code: 'users', data: { __name: 'Юлия Гаврилова ' } },
        { code: 'users', data: { __id: '#', __name: 'Юлия Гаврилова ' } },
        { code: 'users', data: { __id: '#', __name: undefined } },
        { code: 'users', data: { __id: undefined, __name: undefined } },
      ],
    },
    {
      name: 'Б компания 4',
      desc: 'Описание Компании 4',
      file: { data: { __id: '#', __name: 'file 4' } },
      date: '15.12.2022',
      user: { code: 'users', data: { __id: '#', __name: 'Анна Блок' } },
    },
  ],
};

const table = new Table(mockData.header, { sorting: true });

mockData.rows.forEach((data) => {
  const row = table.insert();

  for (const key in data) {
    row[key] = data[key];
  }
});

const htmlTable = table.getTable();

document.getElementById('root').innerHTML = htmlTable;
