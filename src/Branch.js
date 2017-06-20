import React, {Component} from 'react';

import difference_in_minutes from 'date-fns/difference_in_minutes'
import map from 'lodash.map'

import formatLatestAnnouncement from './formatLatestAnnouncement'

export default class Branch extends Component {
    fontSize() {
        return {normal: 0.3, expanded: 0.15, collapsed: 0.6}[this.props.size]
    }

    render() {
        const trainText = train => {
            return <tspan x="0.05"
                          dy={this.fontSize()}
                          fill={color(train.actual)}
                          key={train.actual.AdvertisedTrainIdent}>
                {formatLatestAnnouncement(train, this.props.stations)}
            </tspan>
        }
        return <g className={`pos-${this.props.position}`}>
            <rect onClick={this.props.expand} className="branch" x="0" y="0" height="4" width="4"/>
            <text className="train" style={{fontSize: this.fontSize()}}>
                {map(this.props.trains, trainText)}
            </text>
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
