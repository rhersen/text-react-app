import React, {Component} from 'react';

import filter from 'lodash.filter'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'
import minby from 'lodash.minby'
import orderby from 'lodash.orderby'
import reject from 'lodash.reject'

import * as grid from './grid'
import * as wgs from './wgs'
import Branch from './Branch'

export default class Trains extends Component {
    render() {
        const grouped = groupby(
            this.current(this.props.result.TrainAnnouncement, this.props.stations),
            train => this.branch(train))

        return <g>
            {map({
                    nw: 'translate(5,5)',
                    ne: 'translate(190,5)',
                    sw: 'translate(5,375)',
                    se: 'translate(190,375)',
                    c: 'translate(98,190)'
                },
                (x, key) =>
                    <Branch key={key} trains={grouped[key]} transform={grid.transform(key)} stations={this.props.stations}/>)}
        </g>
    }

    current() {
        const grouped = groupby(this.props.result.TrainAnnouncement, 'AdvertisedTrainIdent')
        const object = filter(map(grouped, announcementsToObject), 'actual')
        const sorted = this.sortTrains(object, direction(this.props.result.TrainAnnouncement), this.props.stations)
        return reject(sorted, hasArrivedAtDestination)

        function announcementsToObject(v) {
            const actual = maxby(filter(v, 'TimeAtLocation'), a => a.TimeAtLocation + a.ActivityType)
            const next = minby(reject(v, 'TimeAtLocation'), a => a.AdvertisedTimeAtLocation + a.ActivityType)

            return {actual, next}
        }

        function direction(announcements) {
            return announcements.length && /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)
        }

        function hasArrivedAtDestination(train) {
            return train.actual.ActivityType === 'Ankomst' && map(train.actual.ToLocation, 'LocationName').join() === train.actual.LocationSignature
        }
    }

    sortTrains(object, dir) {
        return orderby(object, [a => this.north(a.actual.LocationSignature, this.props.stations), 'actual.ActivityType', 'actual.TimeAtLocation'], ['desc', dir ? 'asc' : 'desc', dir ? 'desc' : 'asc'])
    }

    north(location) {
        if (location === 'Gdv') return this.between('Ngd', 'Nyh')
        if (location === 'Söc') return this.between('Söd', 'Söu')
        if (location === 'Gn') return this.between('Mö', 'Ssä')
        return wgs.north(location, this.props.stations)
    }

    between(loc1, loc2) {
        return (wgs.north(loc1, this.props.stations) + wgs.north(loc2, this.props.stations)) / 2
    }

    branch(train) {
        const location = train.actual.LocationSignature
        const n = wgs.north(location, this.props.stations)

        if (n > 59.64) return 'ne'
        if (n > 59.407) return 'n' + this.leftRight(location, 17.84)
        if (n > 59.36) return 'n' + this.leftRight(location, 18)
        if (n < 59.17) return 's' + this.leftRight(location, 17.84)
        if (n < 59.27) return 's' + this.leftRight(location, 18)
        return 'c'

    }

    leftRight(location, limit) {
        return wgs.east(location, this.props.stations) < limit ? 'w' : 'e'
    }
}
