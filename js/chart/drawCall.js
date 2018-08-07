
const drawCall = (o) => {
  let drawFn = o.drawFn  // how to do this more neat ?!?!
  let target = o.target
  let data = o.data
  let svg = o.svg

  // a bit diff course of action depending on target being
  // array of one container for all graphs or array of container for each graph
  if (target.length == 1) {

    target = d3.select(target[0])
        .append('div')           // in this 1 div
        .attr('class', 'graphs')
        .selectAll('.graph-box') // we will append all .graph-box containers
        .data(data).enter()      // in total of data.length elements

  } else target = d3.selectAll(target) // array of hostContainers selections, that each will be appended a .graph-box container


  const genSvgHost = (target) => {
    let svgHost = target
    // .append('div')
        // .attr('class', 'graph-box')
      .append('svg')
        .attr('width', svg.width)
        .attr('height', svg.height)
      .append('g')
        .attr('width', svg.innerWidth)
        .attr('height', svg.innerHeight)
        .attr("transform", "translate(" + svg.margin.left + "," + svg.margin.top + ")")
    return svgHost
  }

  let svgContainer = target.append('div').attr('class', 'graph-box')

  let svgHost = genSvgHost(svgContainer)

  svgContainer.append('div')
    .attr('class', 'tooltip')

  svgHost.each( (d,i,g) => drawFn(d, g[i]) )

}

export default drawCall
