import React, {Component} from 'react';
import difference_in_seconds from 'date-fns/difference_in_seconds'
import map from 'lodash.map'

import * as delay from './delay'
import * as wgs from './wgs'

export default class Train extends Component {
    render() {
        const a = this.props.train.actual
        return <div key={a.AdvertisedTrainIdent}
                    style={{color: delay.color(a), textAlign: x(a.LocationSignature, this.props.stations)}}>
            {formatLatestAnnouncement(this.props.train, this.props.stations)}
        </div>
    }
}

function x(location, stations) {
    const n = wgs.north(location, stations)

    return n > 59.64 ? 'right' :
        n > 59.407 ? leftRight(location, 17.84) :
            n > 59.36 ? leftRight(location, 18) :
                n < 59.17 ? leftRight(location, 17.84) :
                    n < 59.27 ? leftRight(location, 18) :
                        'center'

    function leftRight(location, limit) {
        return wgs.east(location, stations) < limit ? 'left' : 'right'
    }
}

function formatLatestAnnouncement(train, stations) {
    const a = train.actual

    if (!a) return 'Aktuell information saknas'

    return <span>
        {id(a)}
        mot {to(a)} {activity(a)} {location(a)} {delay.precision(a)} {a.TimeAtLocation.substring(11, 16) + next(train)}
        </span>

    function to() {
        return map(map(a.ToLocation, 'LocationName'), stationName)
    }

    function location(a) {
        return stationName(a.LocationSignature)
    }

    function stationName(locationSignature) {
        return (stations && stations[locationSignature] && stations[locationSignature].AdvertisedShortLocationName) || locationSignature
    }

    function relativeTime() {
        const t = train.next.EstimatedTimeAtLocation ? train.next.EstimatedTimeAtLocation : train.next.AdvertisedTimeAtLocation

        return difference_in_seconds(t, new Date())
    }

    function next() {
        if (!train.next) return ''

        return train.next.ActivityType === 'Ankomst' ?
            ` ank ${location(train.next)}  ${relativeTime()} s` :
            ` avg ${relativeTime()} s`
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
