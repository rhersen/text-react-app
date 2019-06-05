const fetch = require('node-fetch')

exports.handler = (event, context, callback) => {
  fetch('http://api.trafikinfo.trafikverket.se/v1.2/data.json', {
    method: 'POST',
    body: getBody(),
    headers: {
      'Content-Type': 'application/xml',
      Accept: 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        callback(null, {
          statusCode: response.status,
          body: response.statusText,
        })
      }
      return response.json()
    })
    .then(data => data.RESPONSE.RESULT[0].TrainStation)
    .then(stations => {
      stations.forEach(station => {
        const match = /POINT \(([\d\\.]+) ([\d\\.]+)\)/.exec(
          station.Geometry.WGS84
        )
        station.east = match[1]
        station.north = match[2]
      })
      return stations
    })
    .then(data =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      })
    )
    .catch(err => {
      console.log(err) // output to netlify function log
      return { statusCode: 500, body: JSON.stringify({ msg: err.message }) } // Could be a custom message or object i.e. JSON.stringify(err)
    })
}

function getBody() {
  return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
     <QUERY objecttype='TrainStation'>
      <FILTER>
       <OR>
         <IN name='CountyNo' value='1' />
         <EQ name='LocationSignature' value='U' />
         <EQ name='LocationSignature' value='Kn' />
         <EQ name='LocationSignature' value='Gn' />
         <EQ name='LocationSignature' value='Bål' />
       </OR>
      </FILTER>
      <INCLUDE>LocationSignature</INCLUDE>
      <INCLUDE>AdvertisedLocationName</INCLUDE>
      <INCLUDE>AdvertisedShortLocationName</INCLUDE>
      <INCLUDE>Geometry</INCLUDE>
     </QUERY>
</REQUEST>`
}
