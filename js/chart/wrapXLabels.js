
const wrapToWidth = (d,i,g,w) => {

  // fn to return somelongblablatext as 'some..ext'
  const trim = (text, maxLen) => {
    if (text.length < maxLen) return;
    text = text.slice(0,5).concat(['..']).concat(text.slice(-3))
    return text
  }


  let textEl = g[i]
  let d3Text = d3.select(textEl)

  if (textEl.getBBox().width < w) return;

  let textPieces = d.split(/[^A-Za-z0-9@.]/).filter( x => Boolean(x) )

    // trim pieces of text that are still too long
  let textMaxLen = 9  // author decision
  textPieces = textPieces.map( x => {
    if (x.length > textMaxLen) return trim(d, textMaxLen)
    else return x
  })

  // return if it was only one
  if (textPieces.length == 1) {
    d3Text.text(textPieces[0])
    return
  }

  // Put pieces of label in multiple lines
  let lineHeight = 1.1 //em
  let textAttr = Array.from(textEl.attributes)
  d3Text.text(null)

  textPieces.forEach( (x, i) => {
    if (!x) return;

    d3Text.append('tspan')
      .text(x)
      .attr('y', textAttr.find( elem => elem.name == 'y').value)
      .attr('x', 0)
      .attr('dy', lineHeight*(i+1).toFixed(2) + 'em')
  })

}

const wrapXLabels = (target, width) => {
  target.selectAll('.x-axis .tick text')
      .each( (d,i,g) => wrapToWidth(d,i,g, width) )
}

export default wrapXLabels
