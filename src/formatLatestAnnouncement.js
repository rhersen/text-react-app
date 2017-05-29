import map from 'lodash.map'

import difference_in_minutes from 'date-fns/difference_in_minutes'

export default function formatLatestAnnouncement(train, stations) {
    const a = train.actual

    if (!a) return 'Aktuell information saknas'

    return id(a) + ' ' + map(a.ToLocation, 'LocationName') + ' ' + activity(a) + ' ' + location(a) + ' ' + precision(a)

    function location(a) {
        return stationName(a.LocationSignature)
    }

    function stationName(locationSignature) {
        return (stations && stations[locationSignature] && stations[locationSignature].AdvertisedShortLocationName) || locationSignature
    }
}

function id(a) {
    return a.AdvertisedTrainIdent
}

function activity(a) {
    return a.ActivityType === 'Ankomst' ?
        'ank' :
        'avg'
}

function precision(a) {
    const delay = minutes(a)

    return delay === 1 ? '' :
        delay > 0 ? `${delay} min
                           sent` : delay < -1 ? 'i god tid' :
            ''

}

function minutes(a) {
    return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}
