
/***
  For a set of data = [ obj, obj, obj ] convert all properties that have strings instead of numbers

  (1) identify obj properties that contain strings which MAY be numbers  => qualifiedProperties
  (2) For each qualifiedProperty of each obj:
   - convert to NaN strings that contain other things than digits, except '.' decimal separator
   - convert to numbers the other strings
***/

const isFutureNo = (str) => {
  if (str[0] == '0' && str[1] != '.') return false // check for cases lik '094'-0 returns 94

  if (!isNaN(str-0)) return true
  return false
}


const getKeysWithFutureNumbers = (obj) => {
  let keys = Object.keys(obj)
  let keysWithFutureNumbers = keys.filter( x => isFutureNo(obj[x]))
  return keysWithFutureNumbers
}

const convertObjStrToNo = (obj, key) => {
  if (isFutureNo(obj[key])) return obj[key]-0
  else return NaN
}

const convertFutureNumberValues = (keysArr, obj) => {
  keysArr.forEach( key => obj[key] = convertObjStrToNo(obj, key) )
}

const convertToNumbers = (data) => {
  let keysWithFutureNumbers = getKeysWithFutureNumbers(data[0])
  data.forEach( (obj) => convertFutureNumberValues(keysWithFutureNumbers, obj) )
  return data
}

export { convertToNumbers, getKeysWithFutureNumbers };
