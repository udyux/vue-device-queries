export default (feature, value, device) => {
  if (feature === 'orientation') return () => value === device.orientation

  let [prop, limit] = feature.split('-').reverse()

  const parseValue = (~value.indexOf('em'))
    ? () => parseFloat(value) * device.fontSize
    : () => parseFloat(value)

  return (!limit) ? () => parseValue() === device[prop]
    : (limit === 'min') ? () => parseValue() < device[prop]
    : () => parseValue() > device[prop]
}
