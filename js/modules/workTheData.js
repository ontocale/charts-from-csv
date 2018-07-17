import convertStringsToNumbers from '/js/string-to-number.js'
import drawTable from '/js/drawTable.js'
import graphsConfig from '/js/modules/graphsConfig.js'
import drawGraph from '/js/drawGraph.js'



const workTheData = (config) => {


  d3.csv(`/data/${config.file}.csv`)
    // .then( data => { return data } )  in consola imi da "data" deja transformat de fctia care este in then-ul urmator!! WHY ?!?!
    .then( convertStringsToNumbers ) // TODO: catch if data contains NaN
    .then( drawTable(config) )
    .then ( graphsConfig )
    .then ( drawGraph )
}

export default workTheData
