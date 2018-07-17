
import drawCall from '/js/modules/drawCall.js'
import wrapXLabels from '/js/modules/wrapXLabels.js'
import legend from '/js/modules/legend.js'
import barchart from '/js/modules/prepareBarchart.js'
import gBars from '/js/modules/groupedBars.js'

const drawGraph = (o) => { // o == options
  /*
  o = {
    data: data,
    refinedData: tbodiesData,
    target: target,
    svg: {
      margin: {top, right, bottom, left},
      width: number,
      height: number
    },
    barChart: {
        type: 'simple' || 'grouped',
        barGroup: [col1, .. coln],
        xDomain: colName from data
      },
  }
  */

    let tbodiesData = o.refinedData,
        margin = o.svg.margin,
        innerWidth = o.svg.width - margin.left - margin.right,
        innerHeight = o.svg.height - margin.top - margin.bottom,
        chart = o.chart,
        colIdx_xDomain = chart.colIdx_xDomain,
        isGBar = chart.colIdx_yDomains.length > 1 // is grouped bar


      // !!!! maybe options obj should be passed in these functions (for setting also padding, tick format etc)
    let xScale = barchart.xScale(innerWidth)
    let yScale = barchart.yScale(innerHeight)
    let xGroupScale = isGBar ? gBars.xGroupScale() : null  // if barchart function xScale made to accept options, we can adapt it to be used here
      // xGroupScale range will be [0, x0.bandwidth()], we will be able to set that after we have set xScale.domain

    let colors = d3.schemePaired // arrays of 6 pairs of related colors


    // callback that works just inside host that provides vars like xScale, yScale, isGBar etc
    /** Draw all Graphs **/
    const drawG = (d, gHost) => {
      // set xScale domain
      let xDomain = d.colsData[colIdx_xDomain]
      barchart.setScaleDomain(xScale, xDomain)


      // set yScale domain
      let yDomainValues = isGBar ? chart.colIdx_yDomains.map( x => d3.max(d.colsData[x]) ) : d.colsData[chart.colIdx_yDomains[0]]
      let yDomain = [0, d3.max( yDomainValues )]
      barchart.setScaleDomain(yScale, yDomain).nice()


      // set xGroupScale

      if (isGBar) {
        var xGroupDomain = chart.colIdx_yDomains.map( x => d.colsName[x])
        xGroupScale = gBars.completeScale(xGroupScale, xGroupDomain, xScale.bandwidth())
      }

      let svg = d3.select(gHost)

      let axisBottom = barchart.axisBottom(svg.append('g'), xScale)
          .attr('transform', `translate(0, ${innerHeight})`)
      axisBottom.selectAll('text').style('font-size', '14')

      let axisLeft = barchart.axisLeft(svg.append('g'), yScale)

      let chartBands = svg.append('g')
        .attr('class', 'bands')
        .selectAll('g')
          .data( xDomain )
          .enter()
          .append('g')
            .attr('class', 'band')
            .attr('transform', d => `translate( ${xScale(d)}, 0)`)

      /*/ bandData = [
        [{key: colName1, value: v1}, {key: colName2, value: v2}],
        [{key: colName1, value: v1}, {key: colName2, value: v2}],
        .. [{key: colName1, value: v1}, {key: colName2, value: v2}],
      ]*/
      let bandData = d.rows.map( (row, rowIdx) =>
        chart.colIdx_yDomains.map( barIdx => {
            return {
              key: d.colsName[barIdx],
              value: d.colsData[barIdx][rowIdx]
            }
        })
      )


      chartBands.data(bandData).enter()

      chartBands.each( (d, i, g) => {
        let bars = d3.select(g[i])
            .selectAll('rect')
            .data(d)
            .enter()
            .append('rect')
              .attr('class', 'bar')
              .attr('height', d => innerHeight - yScale(d.value))
              .attr('y', ( d => yScale(d.value) ) )
              .attr('width', xScale.bandwidth())
              .style('fill', (d,i) => colors[i]) // TODO this depends on what kind of bar/gBar it is (in pairs of just 2 or other)
      })

      if (isGBar) { // overwrite width and add x for grouped bars
        chartBands.each( (d,i,g) => {
          let barWidth = xGroupScale.bandwidth(d.key)
          let xPlaces = d.map( x => xGroupScale(x.key))

          let bars = d3.select(g[i]).selectAll('.bar')
          // .attr('width', xGroupScale.bandwidth(d.key))
          // .attr('x', xGroupScale(d.key))
          .attr('width', barWidth)
          .attr('x', (d,i) => xPlaces[i]  )
        })
      }


      wrapXLabels(svg, xScale.bandwidth())


      let title = legend.title(svg, d.colsData[0], margin)
      title.style('font-size', 18)  // maybe at some point set styles from config (by user)
          .style('font-weight', 'bold')

      let yAxisLabel = isGBar ? null :
            legend.yLabel(svg, d.colsName[chart.colIdx_yDomains[0]], margin)


      if (isGBar) {
        let legendOptions = {
            target: svg,
            width: innerWidth,
            data: xGroupDomain,
            colors: colors
          }
       legend.gBars(legendOptions)
     }

    }


    let drawGraphsOptions = { // how to do this more neat ?!?!
      drawFn: drawG,
      target: o.graphHost.is,
      data: tbodiesData,
      svg: o.svg
    }

    drawCall(drawGraphsOptions)
    /** End Draw all Graphs **/



  return o.data

}


export default drawGraph
