
const graphsConfig = (config) => {

    let configAddon = {
          svg: {
            width: 700,
            height: 430,
            margin: {top: 70, bottom: 80, left: 50, right: 0},
          }
    }

    Object.assign(config, configAddon)

    // overwrite some of config properties
    config.graphHost.is = Array.isArray(config.graphHost.is) && config.graphHost.is.length == 1 ?
                    config.graphHost.is
                    : Array.from(config.graphHost.location.querySelectorAll(`${config.graphHost.selector}`))

    return config
}

export default graphsConfig
