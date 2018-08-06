

const toDoInPage = (config) => {

  let tables = config.tableHost.getElementsByTagName('table')
  if (tables.length > 1) {
    let oldTable = tables[0] // tables.length should be 2
    oldTable.parentNode.removeChild(oldTable)
  }

  return config
}

export default toDoInPage
