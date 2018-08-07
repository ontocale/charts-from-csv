import { convertToNumbers } from './chart/string-to-number.js'
import drawTable from './chart/drawTable.js'
import drawGraph from './chart/drawGraph.js'
import genChartConfig from './chart/generateChartConfig.js'
import toggleTableCharts from './chart/toggleTableCharts.js'
import toDoInPage from './pageActionAtQuerySuccess.js'
import updateQueryHistory from './chart/updateQueryHistory.js'

const addChartConf = (config) => {
  let moreConf= {
    svg: {   // for now, standard svg box
      width: 700,
      height: 430,
      margin: {top: 70, bottom: 80, left: 50, right: 0},
    }
  }
  Object.assign(config.chart, moreConf)

                      // default graph host: each graph in its table section
                      // than should also trigger DOM watcher for table after charts are inserted
  config.chart.host = config.tableHost.querySelectorAll('tbody th[rowspan]')
  return config
}

const setYasqe = (config) => {
  // let textArea = document.getElementById('query-gen')

  // const yasqe = YASQE.fromTextArea(textArea, {
  const yasqe = YASQE(config.yasqeBox, {
    persistent: null,
    sparql: {
      showQueryButton: true,
      endpoint: "http://35.156.71.103/vivo/admin/sparqlquery",
      callbacks: {
        success: function (data, status, xhrObj) {
            xhrObj.then( (data) => {
              return d3.csvParse(data)
            })
            .then( convertToNumbers )
            .then( drawTable({ tableHost: config.yasqeBox }) )
            .then( toDoInPage )
            .then( addChartConf )
            .then( drawGraph )
            .then( genChartConfig )
            .then( toggleTableCharts )
            .then( updateQueryHistory )
            // TODO catch err smthg
          }
          // TODO at fail clean yasqe -> yasqe.setValue('')
      },
      args: [{
        name: "resultFormat",
        value: "text/csv"
      }]
    }
  })


  return yasqe

}

export default setYasqe
