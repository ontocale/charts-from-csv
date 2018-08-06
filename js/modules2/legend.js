
const legend = {}

legend.title = (target, text, margin) => {
  let title = target.append('text')
    .text( text ) // adapt
    .attr('x', -margin.left)
    .attr('y', -margin.top/2)
    .style('transform', (d,i,gr) => `translate(calc(50% - ${gr[i].getBBox().width / 2}px), 0)`)
  return title
}

legend.yLabel = (target, text, margin) => {
  let yLabel = target.append('text')
      .text(text)
      .attr('x', -margin.left)
      .attr('y', -margin.top/3)
      .attr('class', 'y-label')
  return yLabel
}

legend.gBars = (options) => {
  let legend = options.target.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .style('transform', `translate(0, -50px)`) // should be something derived from margin instead of fixed value of -50
        .selectAll("g")
        .data(options.data)
        .enter()
        .append("g")
        .attr("transform", (d,i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", options.width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", (d, i) => options.colors[i]);

    legend.append("text")
        .attr("x", options.width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
}

export default legend
