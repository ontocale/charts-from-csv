
import drawCall from './modules/drawCall.js'
import wrapXLabels from './modules/wrapXLabels.js'
import legend from './modules/legend.js'
import barchart from './modules/prepareBarchart.js'
import gBars from './modules/groupedBars.js'

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
    let xScale = barchart.scale({
      type: 'scaleBand',
      paddingInner: 0.3,
      paddingOuter: 0.2,
      rangeRound: [0, innerWidth]
    })

    let yScale = barchart.scale({
      type: 'scaleLinear',
      rangeRound: [innerHeight, 0]
    })

    let xGroupScale = isGBar ? barchart.scale({
          type: 'scaleBand',
          padding: 0.2
        }) : null
      // xGroupScale range will be [0, x0.bandwidth()], we will be able to set that after we have set xScale.domain

    let colors = d3.schemeCategory10 // arrays of 6 pairs of related colors


    // callback that works just inside host that provides vars like xScale, yScale, isGBar etc
    /** Draw all Graphs **/
    const drawG = (d, gHost) => {
      // complete xScale with domain
      let xDomain = d.colsData[colIdx_xDomain]
      barchart.scale({
        scaleFn: xScale,
        domain: xDomain
      })

      // complete yScale with domain
      let yDomainValues = isGBar ? chart.colIdx_yDomains.map( x => d3.max(d.colsData[x]) ) : d.colsData[chart.colIdx_yDomains[0]]
      let yDomain = [0, d3.max( yDomainValues )]
      barchart.scale({
        scaleFn: yScale,
        domain: yDomain,
      })

      // complete xGroupScale
      if (isGBar) {
        var xGroupDomain = chart.colIdx_yDomains.map( x => d.colsName[x])
        xGroupScale = barchart.scale({
          scaleFn: xGroupScale,
          domain: xGroupDomain,
          rangeRound: [0, xScale.bandwidth()]
        })
      }

      let svg = d3.select(gHost)

      let axisBottom = barchart.axis({
        type: 'axisBottom',
        target: svg.append('g'),
        scaleFn: xScale,
        attr: {
          class: 'axis x-axis',
          transform: `translate(0, ${innerHeight})`
        }
      })

      let axisLeft = barchart.axis({
        type: 'axisLeft', // type
        target: svg.append('g'),
        scaleFn: yScale,
        attr: {
          class: 'axis y-axis'
        }
      })

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
              .attr('x', ( d => xScale(d.key) ) )
              .attr('width', xScale.bandwidth())
              .style('fill', (d,i) => colors[i]) // TODO this depends on what kind of bar/gBar it is (in pairs of just 2 or other)
      })

      if (isGBar) {
        chartBands.each( (d,i,g) => {
          // overwrite width and add x for grouped bars
          let barWidth = xGroupScale.bandwidth(d.key)
          let xPlaces = d.map( x => xGroupScale(x.key))

          let band = d3.select(g[i])
          let bars = band.selectAll('.bar')
            .attr('width', barWidth)
            .attr('x', (d,i) => xPlaces[i]  )
        })
      }


      wrapXLabels(svg, xScale.bandwidth())


      let title = legend.title(svg, d.colsData[0], margin).attr('class', 'title')

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


     /*** TOOLTIP ***/
     chartBands.each( (d,i,g) => {
       let band = d3.select(g[i])

       // invisible el to hover over
       let hoverBorders = g[i].getBBox()
       let hoverTarget = !isGBar ? band.select('.bar')
           : band.append('rect')
               .attr('class', 'hover-borders')
               .attr('width', hoverBorders.width)
               .attr('height', hoverBorders.height)
               .attr('x', hoverBorders.x)
               .attr('y', hoverBorders.y)

       // create ttp content, display; clean and remove at mouseleave
       let ttp = g[i].closest('.graph-box').querySelector('.tooltip')
       let d3Ttp = d3.select(ttp)

       let ttpLeft = margin.left
           + g[i].transform.animVal[0].matrix.e
           + hoverBorders.width/2
           + +hoverTarget.attr('x')
       let ttpBot = hoverBorders.height

       hoverTarget.on('mouseover', (d,i,g) => {
          // createHtml(template, vars) --> should be different depending on chart
           d3Ttp.html(
             d.map(x => `<p>${x.key}: <span class='right tr'>${+x.value.toFixed(2)}</span></p>`).join('')
               + `<p class="em">Improvement: <span class='tr'>${+d.reduce( (acc, el, idx, arr) => {
                       acc = idx == 0 ? el.value : acc - el.value;
                       return acc
                     }, 0).toFixed(2)}</span></p>`
                 )
             .classed('show', true)
             .style('left', `${ ttpLeft - ttp.getBoundingClientRect().width/2 }px`)
       })

         .on('mousemove', (d,i,g) => {
               d3Ttp.style('top',  d3.event.offsetY - ttp.getBoundingClientRect().height - 30 + 'px') //-
         })
         .on('mouseleave', (d,i,g) => {
           d3Ttp.html('')
             .classed('show', false)
         })

     })
     /*** END TOOLTIP ***/


   } /*** END DrawG ***/


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
