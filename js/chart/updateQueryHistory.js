import {setActivePage, setActiveNavBtn, removeGhostElements} from '../nav.js'


const updateQueryHistory = (data) => {
  let linkToKeep = document.querySelector('.query-history .ghost') 
  if (!linkToKeep) return

  linkToKeep.classList.remove('ghost')
  setActiveNavBtn(linkToKeep)

  let queryBox = document.querySelector('.js-query-box.ghost')
  if (queryBox) queryBox.classList.remove('ghost')

  return data
}

export default updateQueryHistory
