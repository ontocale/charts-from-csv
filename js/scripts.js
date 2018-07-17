import { initFirstQuery } from '/js/init-content.js'
import { switchQuery } from '/js/new-query.js'
import domObserver from '/js/modules/domObserver.js'


const init = (e) => {

  initFirstQuery(1) // defaultQuery ||

  document.querySelector('.main-nav').addEventListener('click', (e) => {
    if(!e.target.className.includes('nav-btn')) return

    if (document.querySelector(`.js-query-box-${e.target.id}`) &&
        document.querySelector(`.js-query-box-${e.target.id}`).classList.contains('show')
      ) return

    switchQuery(e)

  })


  domObserver()


}

document.addEventListener('DOMContentLoaded', init, false)
