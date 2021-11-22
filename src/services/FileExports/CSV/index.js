export default function Csv() { }

Csv.parse = function (data) { }

Csv.compose = function (header, data) {
  let values = [];
  let csv = header.join(';');
  // console.log({ data });

  // each object values
  data.map(row => values.push(Object.values(row)))

  // create rows by multi-dimensinal array
  values.forEach(line => {
    csv += '\n'
    csv += line.join(';')
  })

  return csv
}

Csv.download = function (blob) {
  const filename = `${new Date()}.csv`;
  if (window.navigator.msSaveOrOpenBlob) {  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    window.navigator.msSaveBlob(blob, filename);
  }
  else {
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
    a.download = filename;
    document.body.appendChild(a);
    a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a);
  }
  // window.navigator.msSaveBlob(blob, "filename.csv");
}

/**
 * const data = [
 *  { header1: 1, header2: 2},
 *  { header1: 3, header2: 4},
 * ]
 * Csv.generate(data)
 */
Csv.generate = async function () {
  let header = [];

  await Array.from(document.querySelectorAll("th.export")).forEach((item) => {
    header.push(item.textContent);
  });

  const maxCols = header.length;
  let rows = [];
  let cols = [];
  let i = 0;
  await Array.from(document.querySelectorAll("td.export")).forEach((item) => {
    i++;
    cols.push(item.textContent);
    if (i >= maxCols) {
      rows.push(cols);
      cols = [];
      i = 0;
    }
  });

  if (!Array.isArray(rows)) {
    throw new Error(`Csv generate should be receive array with inside objects`)
  }

  const cache = await Csv.compose(header, rows);
  Csv.download(new Blob([cache], { type: 'text/csv', endings: 'native' }));
}