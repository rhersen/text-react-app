import React, {Component} from 'react';

import filter from 'lodash.filter'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'
import minby from 'lodash.minby'
import orderby from 'lodash.orderby'
import reject from 'lodash.reject'

import * as wgs from './wgs'
import Train from './Train'

export default class Trains extends Component {
    render() {
        return <div className="trains">{map(current(this.props.result.TrainAnnouncement, this.props.stations), train => <Train
            train={train} key={train.actual.AdvertisedTrainIdent} stations={this.props.stations}/>)}</div>
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
