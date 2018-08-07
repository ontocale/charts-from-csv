
import drawCall from './drawCall.js'
import wrapXLabels from './wrapXLabels.js'
import legend from './legend.js'
import barchart from './prepareBarchart.js'
import createTooltip from './createTooltip.js'

const drawGraph = (o) => { // o == options
  /*
  o = {
    data: data,
    refinedData: tbodiesData,
    svg: {
      margin: {top, right, bottom, left},
      width: number,
      height: number
    },
    chart: {
        type: 'bar',
        domainsName: { x: stringName; y: stringName || [sN, sN]}
        // addToTooltip: <p> ... html with ${ colIdx_yDOmains[x] maybe math operation here } to be evaluated for each bar</p>
      },
  }
  */

    let tbodiesData = o.refinedData,
        chart = o.chart,
        margin = chart.svg.margin,
        innerHeight = chart.svg.height - margin.top - margin.bottom,
        innerWidth = chart.svg.width - margin.left - margin.right,
        xDomainName = chart.domainsName.x,
        yDomainsName = chart.domainsName.y,
        yDomainsMap = null,  // needed in createTooltip for custom tooltip / not used right now

        isGBar = yDomainsName.length > 1 // is grouped bar

    let yDomainsIdx = yDomainsName.map( x => o.data.columns.indexOf(x)) // yDomainsIdx in colsData
    // let yDomainsIdx = yDomainsName.map( x => d.colsName.indexOf(x)) // yDomainsIdx in colsData


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

    let colors = d3.schemeCategory10

    // callback that works just inside host that provides vars like xScale, yScale, isGBar etc
    /** Draw all Graphs **/
    const drawG = (d, gHost) => {

      // complete xScale with domain
      let xDomainIdx = d.colsName.indexOf(xDomainName)
      let xDomain = d.colsData[xDomainIdx]
      barchart.scale({
        scaleFn: xScale,
        domain: xDomain
      })


      let yDomainsValues = []
      yDomainsIdx.forEach( x => yDomainsValues = yDomainsValues.concat(d.colsData[x]))

      let yDomain = [0, d3.max(yDomainsValues)]
      barchart.scale({
        scaleFn: yScale,
        domain: yDomain,
      })

      // complete xGroupScale
      if (isGBar) {
        var xGroupDomain = yDomainsName;
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
        yDomainsIdx.map( (barIdx, i) => {
            return {
              key: yDomainsName[i],
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
              .style('fill', (d,i) => colors[i])
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

      let yAxisLabel = isGBar ? null : legend.yLabel(svg, yDomainsName[0], margin)

      if (isGBar) {
        let legendOptions = {
            target: svg,
            width: innerWidth,
            data: xGroupDomain,
            colors: colors
          }
       legend.gBars(legendOptions)
     }


     // /*** create TOOLTIP and display as needed ***/

     chartBands.each( (d,i,g) => {
       //TODO - split following code somehow into smaller Fns -- createHoverTarget(), createTtp(), behaveAtHover()

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

        const createTtp = createTooltip({
          addedHtml: chart.addToTooltip,
          yDomainsMap,
          ttp,
          ttpLeft,
          d3Ttp,
        })

        hoverTarget.on('mouseover', createTtp)

          .on('mousemove', (d,i,g) => {
            d3Ttp.style('top',  d3.event.offsetY - ttp.getBoundingClientRect().height - 30 + 'px')
          })
          .on('mouseleave', (d,i,g) => {
            d3Ttp.html('')
             .classed('show', false)
          })

     })
     /*** END create TOOLTIP and display as needed ***/

   } /*** END DrawG ***/


    let drawGraphsOptions = { // how to do this more neat ?!?!
      drawFn: drawG,
      target: chart.host,
      data: tbodiesData,
      svg: chart.svg
    }

    drawCall(drawGraphsOptions)
    /** End Draw all Graphs **/

  return o

}


export default drawGraph
