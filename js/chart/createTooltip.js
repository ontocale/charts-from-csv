

const createTooltip = (inputs, d, i, g) => {
  /*
    inputs = {  // object with exterior elements needed in this function
    ttp,
    ttpLeft,
    d3Ttp,
    yDomainsMap,
    addedHtml
  }
  */
  let d3Ttp = inputs.d3Ttp,
    ttp = inputs.ttp,
    ttpLeft = inputs.ttpLeft,
    yDomainsMap = inputs.yDomainsMap,
    addedHtml = inputs.addedHtml

  const createTtp = (d,i,g) => {

    /** code for customizing Ttp **/
    let customContent = addedHtml
    hasCustomContent: {
      if (!customContent) break hasCustomContent;
      let replaceTarget = null
      let substitute = null

      for (let key in yDomainsMap) {
        let keyForRegexp = key.replace('[', '\\[').replace(']', '\\]')
        replaceTarget = new RegExp(keyForRegexp,"g")
        substitute = d.find( x => x.key === yDomainsMap[key]).value

        customContent = customContent.replace(replaceTarget, substitute)
      }

      // extract all ${nrAsString maybe math operation}
      // eval inner operation
      // replace back in customContent
      replaceTarget = customContent.match(/\$(?={)(.*?)}/g)
      substitute = replaceTarget.map( x => {
        return eval(x.slice(2,-1)).toFixed(2)
      })
      substitute.forEach( (x,i) => customContent = customContent.replace(replaceTarget[i], x) )
    }

    // createHtml(template, vars) --> should be different depending on chart
    d3Ttp.html(
          d.map(x => `<p>${x.key}: <span class='right tr'>${+x.value.toFixed(2)}</span></p>`).join('')
        )
        .classed('show', true)
        .style('left', `${ ttpLeft - ttp.getBoundingClientRect().width/2 }px`)

    if (customContent) ttp.innerHTML += customContent

  }

  return createTtp
}



export default createTooltip
