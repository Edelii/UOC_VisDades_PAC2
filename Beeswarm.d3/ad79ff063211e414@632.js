function _1(md){return(
md`# Beeswarm Plot`
)}

function _2(__query,FileAttachment,invalidation){return(
__query(FileAttachment("youtubers_df.csv"),{from:{table:"youtubers_df"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _dodge(){return(
function dodge(data, {radius = 1, x = d => d} = {}) {
  const radius2 = radius ** 2;
  const circles = data.map((d, i, data) => ({x: +x(d, i, data), data: d})).sort((a, b) => a.x - b.x);
  const epsilon = 1e-3;
  let head = null, tail = null;

  // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y) {
    let a = head;
    while (a) {
      if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true;
      }
      a = a.next;
    }
    return false;
  }

  // Place each circle sequentially.
  for (const b of circles) {

    // Remove circles from the queue that can’t intersect the new circle b.
    while (head && head.x < b.x - radius2) head = head.next;

    // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, b.y = 0)) {
      let a = head;
      b.y = Infinity;
      do {
        let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
        if (y < b.y && !intersects(b.x, y)) b.y = y;
        a = a.next;
      } while (a);
    }

    // Add b to the queue.
    b.next = null;
    if (head === null) head = tail = b;
    else tail = tail.next = b;
  }

  return circles;
}
)}

function _data(FileAttachment){return(
FileAttachment("youtubers_df.csv").csv({typed: true})
)}

function _chart(data,d3,dodge)
{
  const width = 928;
  const height = 150;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;
  const radius = 3;
  const padding = 1.5;

  const dataSlice = data.slice(0, 100);

  // Define una función para formatear números en millones (1M, 2M, etc.)
  function formatMillions(value) {
    return (value / 1e6).toFixed(1) + "M";
  }

  const x = d3.scaleLinear()
    .domain(d3.extent(dataSlice, d => d["Suscribers"]))
    .range([marginLeft, width - marginRight]);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Configura el eje X con formato "M" para millones
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(formatMillions));

  svg.append("g")
    .selectAll()
    .data(dodge(dataSlice, { radius: radius * 2 + padding, x: d => x(d["Suscribers"]) }))
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => height - marginBottom - radius - padding - d.y)
    .attr("r", radius)
    .attr("fill", d => d.data.Rank) // Asigna el color en función de la columna "Color"
    .append("title")
    .text(d => d.data.name);

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["youtubers_df.csv", {url: new URL("./files/9da5a7922ea013e66deaa02aaa447e42c73c402bb248f0656c740d8b8a6ebfbbfd8ac1d2b38c73820535d933181073fa3e00e5d97a2b9c974ff5054917885345.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _2);
  main.variable(observer("dodge")).define("dodge", _dodge);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("chart")).define("chart", ["data","d3","dodge"], _chart);
  return main;
}
