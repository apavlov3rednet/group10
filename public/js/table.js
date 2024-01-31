class Table extends DOM {
    static generate(arHead = [], arBody = [], arFoot = [], params = {}) {
        let header = Table.wrap(arHead);
        let body = Table.body(arBody);
        let footer = Table.wrap(arFoot, false);

        return Table.create('table', {
            className: (params.className) ? params.className : '',
            attrs: (params.attrs) ? params.attrs : {},
            styles: (params.styles) ? params.styles : {},
            events: {

            },
            children: [
                (header) ? header : '',
                (body) ? body : '',
                (footer) ? footer : '',
            ]
        });
    }

    static wrap(ar = [], isHead = true) {
        if(!ar || ar.length === 0)
            return false;

        let table, tableChild = [];

        ar.forEach(item => {
            tableChild.push(Table.create(
                (isHead) ? 'th' : 'td',
                {
                    text: item,
                    events: {
                        click: (isHead) ? Table.sort : false
                    }
                }
            ));
        });

        table = Table.create(
            (isHead) ? 'thead' : 'tfoot',
            {
                children: [
                    Table.create('tr', {
                        children: tableChild
                    })
                ]
            }
        );

        return table;
    }

    static sort() {}

    static body(ar = []) {
        if(!ar || ar.length === 0)
            return false;

        let table, arRow = [];

        ar.forEach(row => {
            if(row instanceof Array) {
                let obRow, arRowChild = [];

                row.forEach((item, index) => {
                    let reg = new RegExp('^[0-9]{1,5}[\.]{1}[0-9]+$');
                    let str;

                    if(String(item).match(reg)) {
                        if(index === 0) {
                            str = String(item).slice(0,7) + '...';
                        }
                        else {
                            str = DB.getById(item);
                        }
                    }
                    else {
                        str = item;
                    }

                    arRowChild.push(Table.create('td', {text: str}))
                });

                obRow = Table.create('tr', {
                    children: arRowChild
                });

                arRow.push(obRow);
            }
        });

        table = Table.create('tbody', {
            children: arRow
        });

        return table;
    }
}