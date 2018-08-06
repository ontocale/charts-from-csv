
let get = {
  nav: '.main-nav',
  contentBox: '.main-box > .content',
  queryBox: '.js-query-box',
  inputQNameBox: '.content .input-q-name-box', // queryInputBox
  queryHistory: '.main-nav .query-history',
  queryGen: '#query-gen'
}

let id = {
  newQueryNavBtn: 'new-query',
  prevQueryNavBtn: 'prev-query'
}
let cl = { // class
  queryBox: 'js-query-box',
}

let htmlEl = {
  nav: document.querySelector(get.nav),
  contentBox: document.querySelector(get.contentBox),
  inputQNameBox: document.querySelector(get.inputQNameBox),
  queryHistory: document.querySelector(get.queryHistory),
  queryGen: document.querySelector(get.queryGen),
}

export { get, id, cl, htmlEl }
