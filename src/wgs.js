export function east(location, stations) {
  const geometry = stations && stations[location]
  return geometry && geometry.east
}

export function north(location, stations) {
  const geometry = stations && stations[location]
  return geometry && geometry.north
}
