const createsvg = (d3, data, svg) =>
{
    var mapData = generateMap(data.records);

    var width = getWidth();
    var radius = getRadius(width);

    var cluster = getTree(d3, radius);
    var line = getLine(d3, radius);
    
    var hier1 = hierarchy(mapData);
    var hier = d3.hierarchy(hier1);
    var bil = bilink(hier);
    var root = cluster(bil);

    svg.attr("viewBox", [-width / 2, -width / 2, width, width]);

      const node = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
        .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
        .text(d => d.data.name)
        .each(function (d) { d.text = this; })
        .on("mouseover", overed)
        .on("mouseout", outed)
        .call(text => text.append("title").text(d => `${id(d)}
        ${d.outgoing.length} outgoing
        ${d.incoming.length} incoming`));

      const link = svg.append("g")
        .attr("stroke", getColornone)
        .attr("fill", "none")
        .selectAll("path")
        .data(root.leaves().flatMap(leaf => leaf.outgoing))
        .enter().append("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([i, o]) => line(i.path(o)))
        .each(function (d) { d.path = this; });

      function overed(d)
      {
        link.style("mix-blend-mode", null);
        d3.select(this).attr("font-weight", "bold");
        d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", getColorin).raise();
        d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", getColorin).attr("font-weight", "bold");
        d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", getColorout).raise();
        d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", getColorout).attr("font-weight", "bold");
      }

      function outed(d)
      {
        link.style("mix-blend-mode", "multiply");
        d3.select(this).attr("font-weight", null);
        d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
        d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
        d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
        d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
      }
};




function title(node)
{
    var name = node.data.name;
    var title = name;

    if (node.outgoing != null)
    {
        title += ', Outgoing: ' + node.outgoing.length;
    }

    if (node.incoming != null)
    {
        title += ', Incoming: ' + node.incoming.length;
    }

    return title;
}

function generateMap(data)
{
    var items = [];
    var count = 0;
    var prefix = 'org.';

    data.forEach(function (val, ind)
    {
        var key = prefix + val.RefMetadataComponentType + "." + val.RefMetadataComponentName;
        var childName = prefix + val.MetadataComponentType + '.' + val.MetadataComponentName;

        childName = cleanName(childName);

        var found = false;

        for (var i = 0; i < items.length && !found; i++)
        {
            var item = items[i];
            if (item.name == key)
            {
                found = true;
                if (!item.imports.includes(childName))
                {
                    item.imports.push(childName);
                }
            }
        }

        if (!found)
        {
            var item = getObject(key);
            item.imports.push(childName);
            items.push(item);
        }
        count++;
    })

    addParents(items);

    return items;
};

function cleanName(name)
{
    var index = name.lastIndexOf(".cmp");
    if (index > -1)
    {
        name = name.substring(0, index);
    }

    var replaceFields = ['_', ' ', ':'];
    for (var i = 0; i < replaceFields.length; i++)
    {
        name = name.replace(replaceFields[i], '');
    }
    return name;
};

function getObject(name)
{
    var item = {};
    item.name = name;
    item.size = 1;
    item.imports = new Array();
    return item;
};

function addParents(items)
{
    for (var i = 0; i < items.length; i++)
    {
        var newItem = items[i];
        for (var j = 0; j < newItem.imports.length; j++)
        {
            var child = newItem.imports[j];
            if (!items.some(p => p.name === child))
            {
                var item = getObject(child);
                items.push(item);
            }
        }
    }
};

function hierarchy(data, delimiter = ".")
{
    let root;
    const map = new Map;
    data.forEach(function find(data)
    {
        const { name } = data;
        if (map.has(name)) return map.get(name);
        const i = name.lastIndexOf(delimiter);
        map.set(name, data);
        if (i >= 0)
        {
            var tmp = find({ name: name.substring(0, i), children: [] });
            if(!tmp.children) {
                console.log('Fixed missing children, could be edge case to be aware of');
                tmp.children = new Array();
            }
            tmp.children.push(data);
            data.name = name.substring(i + 1);
        } else
        {
            root = data;
        }
        return data;
    });
    return root;
}

function bilink(root)
{
    const map = new Map(root.leaves().map(d => [id(d), d]));
    for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
    for (const d of root.leaves())
    {
        for (const o of d.outgoing)
        {
            o[1].incoming.push(o);
        }
    }
    return root;
}

const getTree = (d3, radius) => {
    return(d3.cluster().size([2 * Math.PI, radius - 100]));
};

const getLine = (d3) => {
    return(d3.lineRadial()
            .curve(d3.curveBundle.beta(0.85))
            .radius(d => d.y)
            .angle(d => d.x)
    );
};

function getWidth() {
    return 954;
};

function getRadius(width) {
    return width / 2;
};

function getColorin() {
    return "steelblue";
}

function getColorout() {
    return "orange";
}

function getColornone() {
    return "#ccc";
}

function id(node)
{
    return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
}

export { createsvg };