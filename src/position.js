export function x(location, stations) {
    const n = wgsNorth(location, stations)

    return n > 59.64 ? 'right' :
        n > 59.407 ? leftRight(location, 17.84) :
            n > 59.36 ? leftRight(location, 18) :
                n < 59.17 ? leftRight(location, 17.84) :
                    n < 59.27 ? leftRight(location, 18) :
                        'center'

    function leftRight(location, limit) {
        return wgsEast(location, stations) < limit ? 'left' : 'right'
    }
}

export function y(location, stations) {
    return -north(location, stations)

    function north(location) {
        return location === 'Gdv' ? between('Ngd', 'Nyh') :
            location === 'Söc' ? between('Söd', 'Söu') :
                location === 'Gn' ? between('Mö', 'Ssä') :
                    wgsNorth(location, stations)
    }

    function between(loc1, loc2) {
        return (wgsNorth(loc1, stations) + wgsNorth(loc2, stations)) / 2
    }
}

function wgsEast(location, stations) {
    const geometry = stations && stations[location] && stations[location].Geometry
    return geometry && geometry.WGS84 && geometry.WGS84.east
}

function wgsNorth(location, stations) {
    const geometry = stations && stations[location] && stations[location].Geometry
    return geometry && geometry.WGS84 && geometry.WGS84.north
}
