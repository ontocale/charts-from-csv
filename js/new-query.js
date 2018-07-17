import workTheData from '/js/modules/workTheData.js'

const dataWorks = [
  {
    file: 'country-locality-avg-yield',
    tableHost: null,
    data: null,
    refinedData: null,
    graphHost: {
      location: document,
      selector: null, // eg: 'table tr th[rowspan]' -->  string to use in graphHost.location.querySelectorAll(graphHost.selector)
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

const setActiveNav = (e) => {
  let activeNav = document.querySelector('.main-nav .active')
  activeNav.classList.remove('active')
  activeNav = e.target
  activeNav.classList.add('active')
}

const setQueryBox = (e) => { // host for table but also for graphs;  => should be separate

  // create .js-query-box container IF not already in dom
  const queryBoxContainer = document.querySelector('.main-box .content')
  let queryBox = queryBoxContainer.querySelector(`.js-query-box-${e.target.id}`)

  if (!queryBox) {
    queryBox = document.createElement('div')
    queryBox.classList.add('js-query-box', `js-query-box-${e.target.id}`)
    queryBoxContainer.append(queryBox)
  } else queryBox.classList.remove('hidden')

  let activeQueryBox = queryBoxContainer.querySelector('.show')
  activeQueryBox.classList.remove('show')
  activeQueryBox.classList.add('hidden')
  activeQueryBox = queryBox
  activeQueryBox.classList.add('show')

  return activeQueryBox

}

const switchQuery = (e) => {
  setActiveNav(e)
  let activeQueryBox = setQueryBox(e)

  // set config details
  dataWorks[1].tableHost = activeQueryBox
  dataWorks[1].graphHost.location = dataWorks[1].tableHost
  dataWorks[1].graphHost.selector = 'table tr th[rowspan]'

  // dataWorks[1].graphHost.is = [activeQueryBox]

  // if no content in activeQueryBox
  if (!activeQueryBox.firstChild) workTheData(dataWorks[1])
}

export { switchQuery }
