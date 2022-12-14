(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory(root.b);
  }
})(this, function (b) {
  class Table {
    tHead = this.createTHeadNode();
    tBody = document.createElement('tbody');
    rowCellsNames = [];
    border = '0.5px solid #d9d9d9';
    padding = '4px';
    backgroundColor = 'rgba(199, 199, 199, 0.15)';
    isEvenRow = false;

    constructor(headerData, { headerTop } = { headerTop: 0 }) {
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
          align: thData.align,
        });
      }

      this.tHead.style.top = `${headerTop}px`;
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
      if (!text && !href) return;
      const link = document.createElement('a');
      link.textContent = text ?? window.location.origin + href;
      href && link.setAttribute('href', href);
      link.style.display = 'block';
      link.style.margin = '5px 0';
      blank && link.setAttribute('target', '_blank');

      return link;
    }

    insert() {
      const tr = this.createNode('tr');
      const row = {};

      for (const { name, type, align } of this.rowCellsNames) {
        const td = this.createCellNode('td');
        if (align === 'left' || align === 'right') {
          td.style.textAlign = align;
        }

        row[name] = {};

        const createLink = this.createLink;

        Object.defineProperty(row, name, {
          set(value) {
            const code = [value].flat(1)[0]?.code;
            const kind = [value].flat(1)[0]?.kind;

            if (type === 'number') {
              td.style.textAlign = 'right';
              td.style.whiteSpace = 'nowrap';
              const numbers = [value].flat(1);
              numbers.forEach((item) => {
                if (isNaN(item)) {
                  console.error('error in type "number": isNaN', item);
                }
                try {
                  let numb = item;
                  if (numb === undefined || numb === null) return;
                  numb = Math.round(numb * 100) / 100;
                  const [intPart, floatPart] = numb.toString().split('.');
                  let count = 0;
                  numb = intPart
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

                  if (floatPart !== undefined) {
                    numb = numb + '.' + floatPart;
                  }
                  const div = document.createElement('div');
                  div.textContent = numb;
                  td.append(div);
                } catch (e) {
                  console.error('error in type "number"', e);
                  td.textContent = value ?? '';
                }
              });
              return;
            }

            if (type === 'file' || code === 'disk_files' || kind === 'file') {
              const files = [value].flat(1);
              try {
                files.forEach((file) => {
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
              const users = [value].flat(1);
              try {
                users.forEach((user) => {
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
              const apps = [value].flat(1);
              try {
                apps.forEach((app) => {
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
              const items = [value].flat(1);
              try {
                items.forEach((item) => {
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

            const arr = [value].flat(1);
            try {
              arr.forEach((item) => {
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

  return {
    Table: Table,
  };
});
