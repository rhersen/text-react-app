import difference_in_minutes from 'date-fns/difference_in_minutes'

export function color(a) {
    const delay = minutes(a)
    return delay < 1 ? '#0f0' : delay < 2 ? '#fff' : delay < 4 ? '#ff0' : delay < 8 ? '#f80' : '#f00'
}

export function precision(a) {
    const delay = minutes(a)

    return delay === 1 ? '' :
        delay > 0 ? `${delay} min
                           sent` : delay < -1 ? 'i god tid' :
                ''

}

function minutes(a) {
    return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}
