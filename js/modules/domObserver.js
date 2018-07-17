


const toShowGraph = (child) => {
  let tbody = child.closest('tbody')

  tbody.addEventListener('click', (e) => {
    if (e.target != child.parentElement) return; //we assume '.graph-box direct child of th'
    tbody.classList.toggle('active-graph')
  })

}

const domObserver = () => {
  let target = document.querySelector('.main-box > .content')
  let config = { attributes: false, childList: true, subtree: true };



  const callback = function(mutationsList) {


    let graphs = Array.from(mutationsList).reduce( (acc, el, i, arr) => {
      if (el.type == 'childList' && el.target.classList.contains('graph-box')) acc.push(el.target)

      return acc;
    }, [])

    graphs.forEach( x => x.closest('tbody').classList.add('inactive-graph') )

    graphs.forEach( x => toShowGraph(x) )


  }

  let observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(target, config)

}


export default domObserver
