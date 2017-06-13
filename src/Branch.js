import React, {Component} from 'react';

import difference_in_minutes from 'date-fns/difference_in_minutes'
import map from 'lodash.map'

import formatLatestAnnouncement from './formatLatestAnnouncement'

export default class Branch extends Component {
    render() {
        const trainText = (train, i) => {
            const size = 14
            return <text x="5" y={size + size * i} fill="white" key={train.actual.AdvertisedTrainIdent}
                         style={{
                             fontFamily: '"Arial Narrow",Arial,sans-serif',
                             fontSize: size,
                             fill: color(train.actual)
                         }}>{formatLatestAnnouncement(train, this.props.stations)}</text>
        }
        return <g className={`pos-${this.props.position}`}>
            <rect x="0" y="0" height="180" width="180" onClick={event => console.log(event.target)} style={{fill: "#000"}}/>
            {map(this.props.trains, trainText)}
        </g>
    }
}

function color(a) {
    const delay = minutes(a)
    return delay < 1 ? '#0f0' : delay < 2 ? '#fff' : delay < 4 ? '#ff0' : delay < 8 ? '#f80' : '#f00'
}

function minutes(a) {
    return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}
