
let gBars = {} //grouped barchart

gBars.xGroupScale = () => {
  return d3.scaleBand().padding(0.2)
}

gBars.completeScale = (target, domain, rangeMax) => {
  target.domain( domain ) // if barchart function xScale made to accept options, we can adapt it to be used here
      .rangeRound( [0, rangeMax] )
  return target
}


export default gBars
