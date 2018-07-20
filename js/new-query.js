import dataConfig from './modules/dataConfig.js'
import workTheData from './modules/workTheData.js'
import setActiveNav from './modules/activeNav.js'
import setQueryBox from './modules/queryBox.js'


const switchQuery = (e) => {
  setActiveNav(e)
  let activeQueryBox = setQueryBox(e)

  // if no content in activeQueryBox
  if (!activeQueryBox.firstChild) {
    // set config details
    dataConfig[1].tableHost = activeQueryBox
    dataConfig[1].graphHost.location = dataConfig[1].tableHost
    dataConfig[1].graphHost.selector = 'table tr th[rowspan]'
    
    // dataConfig[1].graphHost.is = [activeQueryBox]
    workTheData(dataConfig[1])
  }
}

export { switchQuery }
