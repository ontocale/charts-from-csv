import { getKeysWithFutureNumbers as getColsWithNumbers } from './string-to-number.js'

const drawTable = (config) => {

  const tabulate = (data) => {

    // this table will have more tbodies with first th to span multiple rows
    let colIdx = 0
    let colName = data.columns[colIdx]  // TODO set this from drawTable options param

    // create table with top row
    let table = d3.select(config.tableHost).append('table')
        .html('<table><colgroup><col width="140px"></col></colgroup><thead><tr></tr></thead></table>')
    let topTr = table.select('tr')

    let topThs = topTr.selectAll('th')
      .data( data.columns )
      .enter()
      .append('th')
      .text( d => d )


    /****
    IF WE HAVE TO DRAW A TABLE WITH LEFT THs THAT SPAN MULTIPLE ROWS, we need to process data into
    tbodiesData = [ {
          th: thText1
          rowspan: n,
          rows: [ [v1,v2,v3,v4], [v1,v2,v3,v4], [v1,v2,v3,v4] ... [v1,v2,v3,v4] ] // length == n

          // put there also other data that will be needed at drawing chart
          colsName: data.columns,
          colsData: [ [thText1],
            [ rows[0][v1]], rows[1][v1]...rows[n][v1] ],
            [ rows[0][v2]], rows[1][v2]...rows[n][v2] ],
            ..
            [ rows[0][v4]], rows[1][v4]...rows[n][v4] ],
        },
       {},  ..,
       {th: thTextn, rowspan...}
      ]
    // we save a lot of processing if we do all this in 1 reducer
    ****/
    const getTbodiesData = (dataArr, colName) => {

      const reducer = (acc, el, idx, arr) => {
        let tbodyToComplete = (acc.find( x => x.th == el[colName] )) // returns th object or undefined
        let rowValues = Object.values(el).filter(x => x !== el[colName])

        if (tbodyToComplete) {
          tbodyToComplete.rowspan += 1
          tbodyToComplete.rows.push( rowValues )
          tbodyToComplete.colsName = arr.columns
          rowValues.forEach( (x,i) => tbodyToComplete.colsData[i+1].push(x) )

          return acc
        }

        //else
        let tbody = {
          th: el[colName],
          rowspan: 1,
          rows: [ rowValues ],
          colsName: arr.columns,
          colsData: [ [el[colName]],  ] // to be populated with arrays of values for each column in tbody
        }
        // creating rest of colsArrays with their first data in it
        rowValues.forEach(x => tbody.colsData.push([x]))

        acc.push(tbody)

        return acc
      }

      return dataArr.reduce(reducer, [])
    }


    // obtain tbodiesData from processing data
    let tbodiesData = getTbodiesData(data, colName)

    // create all tbodies in table
    let tbodies = table.selectAll('tbody')
        .data( tbodiesData )
        .enter()
        .append('tbody')

    // create all rows in tbodies
    let trs = tbodies.selectAll('tr')
      .data( d => d.rows )
      .enter()
      .append('tr')

    /** create firstRow cells (th + tds) **/
    let firstRow = tbodies.select('tr')

    let ths = firstRow.append('th')
        .each( (d,i,gr) => {
          d3.select(gr[i])
            .attr('rowspan', d.rowspan)
            .text(d.th)
        })

    let firstRowTds = firstRow.selectAll('td')
            .data(d => d.rows[0])
            .enter()
            .append('td')
            .text( d => d)
    /** END create firstRow with th + tds **/

    // create all tds in rest of rows
    let rowsTds = trs.selectAll('td') // first tr will already exist in selection => will not be updated => that's why we had to create it entirely separate
      .data( d => d )
      .enter()
      .append('td')
      .text(d => d)


    /** maybe break chart config completion in other module? **/
    // get number colNames and non-number colNames to let user config table charts
    let colsWithNumbers = getColsWithNumbers(data[0])

    // we suppose there is JUST ONE xDomain, so lets find it
    let colWithoutNumbers = data.columns.slice(1)  // not interested in first column
                                .find( x => !colsWithNumbers.includes(x) )

    /** For now we treat cases where we compare apples with apples => there can be just one xDomain **/

      // return upgraded config
    config.data = data;

    config.chart = {}

    config.chart.yDomainsNameToConfig = colsWithNumbers.length > 1 ? colsWithNumbers : null
    config.chart.domainsName = { // default chart will be siple bar chart with first col from colsWithNumbers
        x: colWithoutNumbers,
        y: config.chart.yDomainsNameToConfig ? colsWithNumbers.slice(0, 1) : colsWithNumbers
    }

    config.refinedData = tbodiesData;

    return config

  }

  return tabulate
}

export default drawTable
