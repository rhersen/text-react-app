import map from "lodash.map";

import difference_in_minutes from "date-fns/difference_in_minutes";

export function line1(train, stations) {
  const a = train.actual;

  if (!a) return "Aktuell information saknas";

  return `${id(a)} mot ${map(map(a.ToLocation, "LocationName"), loc =>
    stationName(loc, stations)
  )} ${precision(a)}`;
}

export function line2(train, stations) {
  const a = train.actual;

  if (!a) return "line2";

  return `${activity(a)} ${location(a)} kl ${a.TimeAtLocation.substring(
    11,
    16
  )}`;

  function location(a) {
    return stationName(a.LocationSignature, stations);
  }
}

function id(a) {
  return a.AdvertisedTrainIdent;
}

function stationName(locationSignature, stations) {
  return (
    (stations &&
      stations[locationSignature] &&
      stations[locationSignature].AdvertisedShortLocationName) ||
    locationSignature
  );
}

function precision(a) {
  const delay = difference_in_minutes(
    a.TimeAtLocation,
    a.AdvertisedTimeAtLocation
  );

  return delay === 1
    ? "nästan i tid"
    : delay > 0
      ? `${delay} minuter försenat`
      : delay < -1 ? "i god tid" : "i tid";
}

function activity(a) {
  return a.ActivityType === "Ankomst" ? "ank" : "avg";
}
