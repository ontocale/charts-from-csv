import { initFirstQuery } from './init-content.js'
import { switchQuery } from './new-query.js'
import domObserver from './modules/domObserver.js'


const init = (e) => {

  initFirstQuery(1) // defaultQuery ||

  document.querySelector('.main-nav').addEventListener('click', (e) => {
    if(!e.target.className.includes('nav-btn')) return

    // if clicks on active btn, return
    if (e.target.className.includes('active')) return

    switchQuery(e)

  })

  domObserver()


}

document.addEventListener('DOMContentLoaded', init, false)
