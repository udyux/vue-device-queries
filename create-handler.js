export default (feature, value, device) => {
  if (feature === 'orientation') return () => value === device.orientation

  let [prop, limit] = feature
    .split('-')
    .reverse()

  const operand = (!limit) ? '=='
    : (limit === 'min') ? '<'
    : '>'

  const parseValue = (~value.indexOf('em'))
    ? () => parseFloat(value) * device.fontSize
    : () => parseFloat(value)

  return () => eval(parseValue() + operand + device[prop])
}
