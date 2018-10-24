import * as wgs from './wgs'

export default function branchDivider(train, stations) {
  const location = train.actual.LocationSignature
  const n = wgs.north(location, stations)

  if (n > 59.64) return 'ne'
  if (n > 59.407) return 'n' + leftRight(location, 17.84)
  if (n > 59.36) return 'n' + leftRight(location, 18)
  if (n < 59.17) return 's' + leftRight(location, 17.84)
  if (n < 59.27) return 's' + leftRight(location, 18)
  return 'c'

  function leftRight(location, limit) {
    return wgs.east(location, stations) < limit ? 'w' : 'e'
  }
}
