

const toggleTableCharts = (chartsConfig) => { // fn written knowing chart will be in tbody. if other cases needed, ADAPT !

  const toggleChart = (e) => {
    e.target.closest('tbody').classList.toggle('active-graph')

  }

  chartsConfig.chart.host.forEach( x => x.classList.add('inactive-graph'))

  chartsConfig.chart.host.forEach( x => x.addEventListener('click', toggleChart))

  return chartsConfig;
}

export default toggleTableCharts
