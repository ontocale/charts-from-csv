import workTheData from './modules/workTheData.js'
import dataConfig from './modules/dataConfig.js'

const initFirstQuery = (queryId) => {
  const activeNav = document.getElementById(`${queryId}`)
  activeNav.classList.add('active')

  const activeQueryBox = document.createElement('div')
  activeQueryBox.classList.add('js-query-box', `js-query-box-${queryId}`, 'show')

  // select queryBoxWrapper and append activeQueryBox
  document.querySelector('.main-box .content').append(activeQueryBox)

  dataConfig[0].tableHost = activeQueryBox
  dataConfig[0].graphHost.location = dataConfig[0].tableHost
  dataConfig[0].graphHost.selector = 'table tr th[rowspan]'
  workTheData(dataConfig[0])
}

export { initFirstQuery }
