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

    constructor(headerData) {
      const headerRow = this.createNode('tr');

      for (const thData of headerData) {
        const th = this.createCellNode('th');
        th.textContent = thData.caption;
        th.style.width = `${thData.width}px`;
        headerRow.append(th);
        this.rowCellsNames.push({ name: thData.name, type: thData.type });
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

    insert() {
      const tr = this.createNode('tr');
      const row = {};

      for (const { name, type } of this.rowCellsNames) {
        const td = this.createCellNode('td');
        row[name] = {};

        Object.defineProperty(row, name, {
          set(value) {
            if (
              ['text', 'date'].includes(type) ||
              typeof value === 'string' ||
              typeof value === 'number'
            ) {
              td.textContent = value;
              return;
            }

            if (type === 'file') {
              td.append(
                createLink({
                  text: value.data?.__name,
                  href: `(p:preview/${value.data?.__id})`,
                })
              );
              return;
            }

            if (type === 'user') {
              td.append(
                createLink({
                  text: value.data?.__name,
                  href: `/profile/${value.data?.__id}`,
                })
              );
              return;
            }

            if (Array.isArray(value)) {
              value.forEach((item) => {
                const div = document.createElement('div');
                div.append(item);
                td.append(div);
              });
              return;
            }

            if (type === 'link') {
              td.append(createLink({ text: value.text, href: value.href }));
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
    name: 'Table',
  };
});

function createLink({ text, href, blank }) {
  const link = document.createElement('a');
  link.textContent = text ?? window.location.origin + href;
  link.setAttribute('href', href);
  blank && link.setAttribute('target', '_blank');

  return link;
}
