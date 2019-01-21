import groupby from 'lodash.groupby'
import filter from 'lodash.filter'
import map from 'lodash.map'
import reject from 'lodash.reject'
import maxby from 'lodash.maxby'
import minby from 'lodash.minby'
import orderby from 'lodash.orderby'
import * as wgs from './wgs'

export default function currentTrains(announcement, stations) {
  const grouped = groupby(announcement, 'AdvertisedTrainIdent')
  const object = filter(map(grouped, announcementsToObject), 'actual')
  const sorted = sortTrains(object, direction(announcement), stations)
  return reject(sorted, hasArrivedAtDestination)

  function announcementsToObject(v) {
    const actual = maxby(
      filter(v, 'TimeAtLocation'),
      a => a.TimeAtLocation + a.ActivityType
    )
    const next = minby(
      reject(v, 'TimeAtLocation'),
      a => a.AdvertisedTimeAtLocation + a.ActivityType
    )

    return { actual, next }
  }

  function direction(announcements) {
    return (
      announcements.length &&
      /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)
    )
  }

  function hasArrivedAtDestination(train) {
    return (
      train.actual.ActivityType === 'Ankomst' &&
      map(train.actual.ToLocation, 'LocationName').join() ===
        train.actual.LocationSignature
    )
  }

  function sortTrains(object, dir) {
    return orderby(
      object,
      [
        a => north(a.actual.LocationSignature, stations),
        'actual.ActivityType',
        'actual.TimeAtLocation',
      ],
      ['desc', dir ? 'asc' : 'desc', dir ? 'desc' : 'asc']
    )
  }

  function north(location) {
    if (location === 'Gdv') return between('Ngd', 'Nyh')
    if (location === 'Söc') return between('Söd', 'Söu')
    if (location === 'Gn') return between('Mö', 'Ssä')
    return wgs.north(location, stations)
  }

  function between(loc1, loc2) {
    return 0.5 * wgs.north(loc1, stations) + 0.5 * wgs.north(loc2, stations)
  }
}
