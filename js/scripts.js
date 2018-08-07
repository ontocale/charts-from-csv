import setYasqe from './queryGenerator.js'
import { setActivePage, setActiveNavBtn, removeGhostElements } from './nav.js'
import { get, id, cl, htmlEl } from './domEls.js'


const init = (e) => {

  let yasqe = null;



  const navAction = (e) => {
    e.preventDefault()
    if (!e.target.classList.contains('nav-btn')) return;
    if (e.target.classList.contains('active')) return;

    if (e.target.id == id.newQueryNavBtn) removeGhostElements()

    if (e.target.id == id.prevQueryNavBtn) htmlEl.queryHistory.classList.toggle('hidden')
    else setActiveNavBtn(e.target)

    if (e.target.dataset.page) setActivePage(e.target)
  }

  const createElementsFromQName = () => {
    let inputVal = htmlEl.inputQNameBox.querySelector('#input-q-name').value
    if ( inputVal.length < 5) return;

    // create nav-link
    let queryNameAsClass = inputVal.toLowerCase().replace(/\s/g, '-')
    htmlEl.queryHistory.innerHTML += `<a class="${queryNameAsClass} ghost nav-btn" data-page=${queryNameAsClass}>${inputVal}</a>`
    let newQLink = htmlEl.queryHistory.querySelector(`.${queryNameAsClass}`)
    //TODO check first if does not already exist

    // create queryPage
    let newQPage = document.createElement('DIV')
    newQPage.innerHTML = `<h2 class='query-page-title'>${inputVal}</h2>`
    newQPage.classList.add(cl.queryBox, queryNameAsClass, 'ghost', 'page')
    htmlEl.contentBox.appendChild(newQPage)

    return { newQLink, newQPage }
  }

  const startNewQueryPage = (e) => {

    let elems = createElementsFromQName()

    setActiveNavBtn(elems.newQLink)
    setActivePage(elems.newQLink)

    yasqe = setYasqe( { yasqeBox: elems.newQPage } )
    yasqe.setValue('')

  }

  htmlEl.nav.addEventListener('click', navAction)
  document.body.addEventListener('click', (e) => {
      if (e.target.id === id.prevQueryNavBtn) return;
      if(!htmlEl.queryHistory.classList.contains('hidden')) {
        htmlEl.queryHistory.classList.add('hidden')
      }
    })

  htmlEl.inputQNameBox.querySelector('#add-q-name').addEventListener('click', startNewQueryPage)

}

document.addEventListener('DOMContentLoaded', init, false)
