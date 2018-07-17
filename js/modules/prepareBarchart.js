// maybe we should pass as options innerWidth, innerHeight (used in making scale and translating xAxis to bottom )
const barchart = {}

// scaleBand for entire horizontal axis ( if isGBar, this is band between groups of bars)
barchart.xScale = (rangeEnd) => {
  let xScale =  d3.scaleBand()
    .paddingInner(0.3)
    .paddingOuter(0.2)
    .rangeRound([0, rangeEnd])
  return xScale
}

barchart.yScale = (rangeStart) => {
  let yScale = d3.scaleLinear()
      .rangeRound([rangeStart, 0])
  return yScale
}

barchart.setScaleDomain = (target, source) => {
  return target.domain(source)
}

barchart.axisBottom = (target, scale) => {
  target.call( d3.axisBottom(scale) )
        .attr('class', 'axis x-axis')
  return target
}
barchart.axisLeft = (target, scale) => {
  target.call(d3.axisLeft(scale))
        .attr('class', 'axis y-axis')
  return target
}

export default barchart
