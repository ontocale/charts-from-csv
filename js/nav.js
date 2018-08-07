import { get, id, cl, htmlEl } from './domEls.js'

const setActivePage = (source) => {
  let activePage = document.querySelector('.page.active')
  if (activePage) activePage.classList.remove('active')
  activePage = htmlEl.contentBox.querySelector(`.${source.dataset.page}`)
  activePage.classList.add('active')
}

const setActiveNavBtn = (target) => {
  let activeLink = htmlEl.nav.querySelector('.nav-btn.active')
  if (activeLink) activeLink.classList.remove('active')
  target.classList.add('active')
}

const removeGhostElements = () => {
  let queryBoxGhost = htmlEl.contentBox.querySelector(get.queryBox + '.ghost')
  if (queryBoxGhost) queryBoxGhost.remove()

  let historyLinkGhost = htmlEl.queryHistory.querySelector('.ghost')
  if ( historyLinkGhost ) historyLinkGhost.remove()
}

export { setActivePage, setActiveNavBtn, removeGhostElements }
