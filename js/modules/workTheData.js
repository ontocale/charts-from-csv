import convertStringsToNumbers from '../string-to-number.js'
import drawTable from '../drawTable.js'
import graphsConfig from './graphsConfig.js'
import drawGraph from '../drawGraph.js'



const workTheData = (config) => {


  d3.csv(`../../data/${config.file}.csv`)
    // .then( data => { return data } )  in consola imi da "data" deja transformat de fctia care este in then-ul urmator!! WHY ?!?!
    .then( convertStringsToNumbers ) // TODO: catch if data contains NaN
    .then( drawTable(config) )
    .then ( graphsConfig )
    .then ( drawGraph )
}

export default workTheData
