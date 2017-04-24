export function east(location, stations) {
    const geometry = stations && stations[location] && stations[location].Geometry
    return geometry && geometry.WGS84 && geometry.WGS84.east
}

export function north(location, stations) {
    const geometry = stations && stations[location] && stations[location].Geometry
    return geometry && geometry.WGS84 && geometry.WGS84.north
}
