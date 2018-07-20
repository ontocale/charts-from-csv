

const common = {
  tableHost: null,
  data: null,
  refinedData: null,
  graphHost: {
    location: document,
    selector: null, // eg: 'table tr th[rowspan]' -->  string to use in graphHost.location.querySelectorAll(graphHost.selector)
    is: []
  }
}

let dataConfig = [
  {
    file: 'country-locality-avg-yield',
    chart: {
      type: 'bar',
      colIdx_xDomain: 1, // index of xDomain in columnsArray
      colIdx_yDomains: [2] // == bandDomains; to be transformed to [dataObj.data.columns[2]]
    },
  },
  {
    file: 'country-locality-avg-yield-by-method',
    chart: {
      type: 'bar',
      colIdx_xDomain: 1, // index of xDomain in columnsArray
      colIdx_yDomains: [2, 3] // ex bandDomains; to be transformed to [dataObj.data.columns[2]]
    }
  }
]

dataConfig.map( x => Object.assign(x, common) )


export default dataConfig
