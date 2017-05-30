import React, {Component} from 'react';

import filter from 'lodash.filter'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'
import minby from 'lodash.minby'
import orderby from 'lodash.orderby'
import reject from 'lodash.reject'

import * as wgs from './wgs'
import formatLatestAnnouncement from './formatLatestAnnouncement'

export default class Trains extends Component {
    render() {
        const trainText = (train, i) => {
            const size = 14
            return <text x="5" y={size + size * i} fill="white" key={train.actual.AdvertisedTrainIdent}
                         style={{
                             fontFamily: '"Arial Narrow",Arial,sans-serif',
                             fontSize: size
                         }}>{formatLatestAnnouncement(train, this.props.stations)}</text>
        }
        const current2 = this.props.result.INFO ? current(this.props.result.TrainAnnouncement, this.props.stations) : []
        const grouped = groupby(current2, train => branch(train.actual.LocationSignature, this.props.stations))
        return <g>
            <g transform="translate(5,5)">
                <rect x="0" y="0" height="180" width="180" style={{stroke: "#ff0000", fill: "#0000ff"}}/>
                {map(grouped.nw, trainText)}
            </g>
            <g transform="translate(190,5)">
                <rect x="0" y="0" height="180" width="180" style={{stroke: "#ff0000", fill: "#0000ff"}}/>
                {map(grouped.ne, trainText)}
            </g>
            <g transform="translate(98,190)">
                <rect x="0" y="0" height="180" width="180" style={{stroke: "#ff0000", fill: "#0000ff"}}/>
                {map(grouped.c, trainText)}
            </g>
            <g transform="translate(5,375)">
                <rect x="0" y="0" height="180" width="180" style={{stroke: "#ff0000", fill: "#0000ff"}}/>
                {map(grouped.sw, trainText)}
            </g>
            <g transform="translate(190,375)">
                <rect x="0" y="0" height="180" width="180" style={{stroke: "#ff0000", fill: "#0000ff"}}/>
                {map(grouped.se, trainText)}
            </g>
        </g>
    }
}

function current(announcements, stations) {
    const grouped = groupby(announcements, 'AdvertisedTrainIdent')
    const object = filter(map(grouped, announcementsToObject), 'actual')
    const sorted = sortTrains(object, direction(announcements), stations)
    return reject(sorted, hasArrivedAtDestination)

    function announcementsToObject(v) {
        const actual = maxby(filter(v, 'TimeAtLocation'), a => a.TimeAtLocation + a.ActivityType)
        const next = minby(reject(v, 'TimeAtLocation'), a => a.AdvertisedTimeAtLocation + a.ActivityType)

        return {actual, next}
    }

    function sortTrains(object, dir, stations) {
        return orderby(object, [a => y(a.actual.LocationSignature, stations), 'actual.ActivityType', 'actual.TimeAtLocation'], ['asc', dir ? 'asc' : 'desc', dir ? 'desc' : 'asc'])
    }

    function direction(announcements) {
        return announcements.length && /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)
    }

    function hasArrivedAtDestination(train) {
        return train.actual.ActivityType === 'Ankomst' && map(train.actual.ToLocation, 'LocationName').join() === train.actual.LocationSignature
    }

    function y(location) {
        return -north(location)

        function north(location) {
            return location === 'Gdv' ? between('Ngd', 'Nyh') :
                location === 'Söc' ? between('Söd', 'Söu') :
                    location === 'Gn' ? between('Mö', 'Ssä') :
                        wgs.north(location, stations)
        }

        function between(loc1, loc2) {
            return (wgs.north(loc1, stations) + wgs.north(loc2, stations)) / 2
        }
    }
}

function branch(location, stations) {
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
