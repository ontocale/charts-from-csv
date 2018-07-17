
const drawCall = (o) => {
  let drawFn = o.drawFn  // how to do this more neat ?!?!
  let target = o.target
  let data = o.data
  let svg = o.svg

  // a bit diff course of action depending on target being
  // array of host elements for each graph or 1 container to wrap all graphs

  if (target.length == 1) {

    target = d3.select(target[0])
        .append('div')           // in this 1 div
        .attr('class', 'graphs')
        .selectAll('.graph-box') // we will append all .graph-box containers
        .data(data).enter()      // in total of data.length elements

  } else target = d3.selectAll(target) // array of hostContainers selections, that each will be appended a .graph-box container


  const genSvgHost = (target) => {
    let svgHost = target.append('div')
        .attr('class', 'graph-box')
      .append('svg')
        .attr('width', svg.width)
        .attr('height', svg.height)
      .append('g')
        .attr('width', svg.innerWidth)
        .attr('height', svg.innerHeight)
        .attr("transform", "translate(" + svg.margin.left + "," + svg.margin.top + ")")
    return svgHost
  }

  let svgHost = genSvgHost(target)

  svgHost.each( (d,i,g) => drawFn(d, g[i]) )

}

export default drawCall
