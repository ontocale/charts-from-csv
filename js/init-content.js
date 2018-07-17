import workTheData from '/js/modules/workTheData.js'

const dataWorks = [
  {
    file: 'country-locality-avg-yield',
    tableHost: null,
    data: null,
    refinedData: null,
    graphHost: {
      location: document,
      selector: 'table tr th[rowspan]', // eg: 'table tr th[rowspan]' -->  string to use in graphHost.location.querySelectorAll(graphHost.selector)
      is: []
    },
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

const initFirstQuery = (queryId) => {
  const activeNav = document.getElementById(`${queryId}`)
  activeNav.classList.add('active')

  const activeQueryBox = document.createElement('div')
  activeQueryBox.classList.add('js-query-box', `js-query-box-${queryId}`, 'show')
  // select queryBoxWrapper and append activeQueryBox
  document.querySelector('.main-box .content').append(activeQueryBox)

  dataWorks[0].tableHost = activeQueryBox
  dataWorks[0].graphHost.location = dataWorks[0].tableHost
  workTheData(dataWorks[0])
}

export { initFirstQuery }
