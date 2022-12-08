class Table {
  tHead = this.createTHeadNode();
  tBody = document.createElement('tbody');
  rowCellsNames = [];
  border = '0.5px solid #d9d9d9';
  padding = '4px';
  backgroundColor = 'rgba(199, 199, 199, 0.15)';
  isEvenRow = false;

  constructor(headerData) {
    if (!headerData) {
      console.error(
        'error in Table constructor: need header to initialize table'
      );
      return;
    }

    const headerRow = this.createNode('tr');

    for (const thData of headerData) {
      const th = this.createCellNode('th');
      th.textContent = thData.caption;
      th.style.width = `${thData.width}px`;
      headerRow.append(th);
      this.rowCellsNames.push({
        name: thData.name,
        type: thData.type,
      });
    }

    this.tHead.append(headerRow);
  }

  createNode(name) {
    return document.createElement(name);
  }

  createCellNode(name) {
    const td = this.createNode(name);
    td.style.border = this.border;
    td.style.padding = this.padding;
    return td;
  }

  createTHeadNode() {
    const tHead = this.createNode('thead');
    tHead.style.zIndex = '100';
    tHead.style.position = 'sticky';
    tHead.style.top = '-14.5px';
    tHead.style.background = '#E4EEF8';
    return tHead;
  }

  createTableNode() {
    const table = this.createNode('table');
    table.style.border = this.border;
    table.style.width = '100%';
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
    table.style.textAlign = 'center';
    table.style.overflowWrap = 'break-word';
    return table;
  }

  createContainerNode() {
    const container = this.createNode('div');
    container.style.width = '100%';
    container.style.position = 'relative';
    return container;
  }

  createWrapperNode() {
    const wrapper = this.createNode('div');
    wrapper.style.minWidth = '830px';
    wrapper.style.marginTop = '12px';
    wrapper.style.marginBottom = '20px';
    return wrapper;
  }

  createLink({ text, href, blank }) {
    const link = document.createElement('a');
    link.textContent = text ?? window.location.origin + href;
    link.setAttribute('href', href);
    blank && link.setAttribute('target', '_blank');

    return link;
  }

  insert() {
    const tr = this.createNode('tr');
    const row = {};

    for (const { name, type } of this.rowCellsNames) {
      const td = this.createCellNode('td');
      row[name] = {};

      const createLink = this.createLink;

      Object.defineProperty(row, name, {
        set(value) {
          if (type === 'number') {
            try {
              let numb = value;
              if (numb === undefined || numb === null) return;
              numb = Math.round(numb * 100) / 100;
              const [start, end] = numb.toString().split('.');
              let count = 0;
              numb = start
                .split('')
                .reverse()
                .reduce((sum, num) => {
                  count++;
                  sum = sum.concat(num);
                  if (count === 3) {
                    count = 0;
                    sum = sum.concat(' ');
                  }
                  return sum;
                }, '')
                .split('')
                .reverse()
                .join('')
                .trim();

              if (end !== undefined) {
                numb = numb + '.' + end;
              }

              td.textContent = numb;
            } catch (e) {
              console.error('error in type === number', e);
              td.textContent = value ?? '';
            } finally {
              td.style.textAlign = 'right';
              return;
            }
          }

          if (type === 'file') {
            try {
              td.append(
                createLink({
                  text: value.data?.__name,
                  href: `(p:preview/${value.data?.__id})`,
                })
              );
            } catch (e) {
              console.error('error in type === file', e);
            } finally {
              return;
            }
          }

          if (type === 'user') {
            try {
              td.append(
                createLink({
                  text: value.data?.__name,
                  href: `/profile/${value.data?.__id}`,
                  blank: true,
                })
              );
            } catch (e) {
              console.error('error in type === user', e);
            } finally {
              return;
            }
          }

          if (type === 'link') {
            try {
              td.append(createLink({ text: value.text, href: value.href }));
            } catch (e) {
              console.error('error in type === file', e);
            } finally {
              return;
            }
          }

          if (Array.isArray(value)) {
            try {
              value.forEach((item) => {
                const div = document.createElement('div');
                div.append(item);
                td.append(div);
              });
            } catch (e) {
              console.error('error in type === array', e);
            } finally {
              return;
            }
          }

          try {
            td.textContent = value;
          } catch (e) {
            console.error('error in undefined type', e);
          } finally {
            return;
          }
        },
      });

      tr.append(td);
    }

    if (this.isEvenRow) {
      tr.style.backgroundColor = this.backgroundColor;
    }

    this.isEvenRow = !this.isEvenRow;
    this.tBody.append(tr);
    return row;
  }

  getTableNode() {
    const table = this.createTableNode();
    table.append(this.tHead, this.tBody);
    return table;
  }

  getTable() {
    const container = this.createContainerNode();
    const wrapper = this.createWrapperNode();
    wrapper.append(this.getTableNode());
    container.append(wrapper);
    return container;
  }
}

const mockData = {
  header: [
    { name: 'name', caption: 'Наименование', width: 200 },
    { name: 'desc', caption: 'Описание', width: 300 },
    { name: 'file', caption: 'Файл', width: 150, type: 'file' },
    { name: 'data_arr', caption: 'Массив' },
    { name: 'numb', caption: 'Число', type: 'number' },
    { name: 'date', caption: 'Дата', width: 100 },
    { name: 'user', caption: 'Пользователь', width: 200, type: 'user' },
  ],
  rows: [
    {
      name: 'Компания 1',
      desc: 'Описание Компании 1',
      file: { data: { __id: '#', __name: 'file 1' } },
      date: '12.12.2022',
      user: { data: { __id: '#', __name: 'Николай Петров' } },
    },
    {
      name: 'Компания 2',
      desc: 'Описание Компании 2',
      file: { data: { __id: '#', __name: 'file 2' } },
      numb: 13242945.121313,
      data_arr: [2, 'строки'],
      date: '13.12.2022',
      user: { data: { __id: '#', __name: 'Андрей Сидоров' } },
    },
    {
      name: 'Компания 3',
      desc: 'Описание Компании 3',
      file: { data: { __id: '#', __name: 'file 3' } },
      numb: 132423.121313,
      date: '14.12.2022',
      user: { data: { __id: '#', __name: 'Юлия Гаврилова ' } },
    },
    {
      name: 'Компания 4',
      desc: 'Описание Компании 4',
      file: { data: { __id: '#', __name: 'file 4' } },
      date: '15.12.2022',
      user: { data: { __id: '#', __name: 'Анна Блок' } },
    },
  ],
};

const table = new Table();

mockData.rows.forEach((data) => {
  const row = table.insert();

  for (const key in data) {
    row[key] = data[key];
  }

  // row.name = data.name;
  // row.desc = data.desc;
  // row.file = data.file;
  // row.data_arr = data.data_arr;
  // row.numb = data.numb;
  // row.date = data.date;
  // row.user = data.user;
});

const htmlTable = table.getTable();

document.getElementById('root').append(htmlTable);
