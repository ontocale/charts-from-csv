

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

const dataConfig = [
  {
    file: 'country-locality-avg-yield',

    chart: { // user will input this kind of data
      type: 'bar',
      colIdx_xDomain: 1, // xDomainIdx: index of xDomain in columnsArray
      colIdx_yDomains: [2] // ex bandDomains; to be transformed to [dataObj.data.columns[2]]
    },
  },
  {
    file: 'country-locality-avg-yield-by-method',
    tableHost: null,
    data: null,
    refinedData: null,  //maybe renamed to 'processed data'
    graphHost: {
      location: document,
      selector: null,
      is: []
    },
    chart: { // user will input this kind of data
      type: 'bar',
      colIdx_xDomain: 1, // xDomainIdx: index of xDomain in columnsArray
      colIdx_yDomains: [2, 3] // ex bandDomains; to be transformed to [dataObj.data.columns[2]]
    }
  }
]

export default dataConfig
