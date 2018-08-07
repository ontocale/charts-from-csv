
const barchart = {}


/*Fn to create axis and set its attributes
  opt = {
  target: d3.select('svg'),
  type: 'axisLeft',
  scaleFn: scaleY,
  attr: {'class', 'axis y-axis'}
  attr: {'data-type', 'whatever'}
}
*/
barchart.axis = (opt) => {
  // maybe first check if op type, target and scaleFn exists !?
  let target = opt.target.call(d3[opt.type](opt.scaleFn))
  delete opt.target
  delete opt.type
  delete opt.scaleFn

  for (let key in opt) {
    if (opt[key] !== null && typeof opt[key] === 'object') {
      Object.keys(opt[key]).forEach( x => target = target[key](x, opt[key][x]))
    }
    else target = target[key](...Object.values(opt[key]))
  }
}

/*** scale function options {
   type: 'scaleBand', /'scaleLinear' etc  (if we init the scaleFn)
   scaleFn: fn, /curriedScaleFnToThisMoment (if scaleFn already exists)
   innerPadding: .3,
   outerPadding: .4,
   padding: .4,
   rangeRound: [0, otherNo],
   ... d3 fns that chain with scale etc ...
 }
 ***/
barchart.scale = (options) => {
  let scaleFn = options.type ? d3[options.type]() : options.scaleFn
  if (!scaleFn) console.error('there is no scaleFn to build on') // this should be a try catch smthg and stop execution ?

  options.type ? delete options.type : delete options.scaleFn

  for (let key in options) { scaleFn = scaleFn[key](options[key]) }

  return scaleFn;
}


export default barchart
