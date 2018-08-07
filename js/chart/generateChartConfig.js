import drawGraph from './drawGraph.js'



const genChartConfig = (o) => {
  if (!o.chart.yDomainsNameToConfig) return o;

  let tableHost = o.tableHost,
      yDomainsNameToConfig = o.chart.yDomainsNameToConfig,
      xDomainName = o.chart.domainsName.x,
      yDomainsName = o.chart.domainsName.y

  let configHost = tableHost.querySelector('thead tr th:first-child'),
      btn = document.createElement('DIV')

  btn.textContent = 'config table charts'
  btn.classList.add('chart-config-btn')
  configHost.appendChild(btn)

  let yDomainsNameHtml = yDomainsNameToConfig.map( x =>
              `<label>
                  <input type=checkbox ${yDomainsName.includes(x) ? 'checked' : ''}
                  name=y-domains-name value=${x}>
                  ${x}
                </label>`
            ).join('')

  let configBox = `
  <div class=config-box>
    <section class=conf-section>
      <h3>Column Name for x-Axis Domain:</h3>
      <label> <input type=radio checked name='x-domain'>${xDomainName}</label>
    </section>
    <section class=conf-section>
      <h3>Column Name(s) for y-Axis Domain(s):</h3>
      ${yDomainsNameHtml}
    </section>
    <button class='reconfig-btn'>Reconfigure Charts</button>
  </div>
  `
  configHost.innerHTML += configBox

  let configBoxEl = configHost.querySelector('.config-box')
  let chartConfigBtnEl = configHost.querySelector('.chart-config-btn')
  let reconfigBtnEl = configHost.querySelector('.reconfig-btn')

  chartConfigBtnEl.addEventListener('click', (e) => configBoxEl.classList.toggle('show'))

  reconfigBtnEl.addEventListener('click', (e) => {
      let inputsForYDomainsName = Array.from(configHost.querySelectorAll('[name=y-domains-name]'))
      o.chart.domainsName.y = []
      inputsForYDomainsName.forEach( x => { if(x.checked) o.chart.domainsName.y.push(x.value) })

      o.chart.host.forEach( x => x.querySelector('.graph-box').remove() )
      configBoxEl.classList.remove('show')
      drawGraph(o)
  })

  return o
}

export default genChartConfig
