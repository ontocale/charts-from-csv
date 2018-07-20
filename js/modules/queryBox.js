
const setQueryBox = (e) => {

  // create .js-query-box container IF not already in dom
  const queryBoxContainer = document.querySelector('.main-box .content')
  let queryBox = queryBoxContainer.querySelector(`.js-query-box-${e.target.id}`)

  if (!queryBox) {
    queryBox = document.createElement('div')
    queryBox.classList.add('js-query-box', `js-query-box-${e.target.id}`)
    queryBoxContainer.append(queryBox)
  }

  let activeQueryBox = queryBoxContainer.querySelector('.show')
  activeQueryBox.classList.remove('show')
  activeQueryBox = queryBox
  activeQueryBox.classList.add('show')

  return activeQueryBox

}

export default setQueryBox
