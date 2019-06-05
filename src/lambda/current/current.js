const fetch = require('node-fetch')

exports.handler = ({ queryStringParameters }, context, callback) => {
  fetch('http://api.trafikinfo.trafikverket.se/v1.2/data.json', {
    method: 'POST',
    body: getBody(queryStringParameters),
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
    .then(data =>
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      })
    )
    .catch(err => {
      console.log(err) // output to netlify function log
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
      }
    })
}

function getBody({ direction }) {
  return `
<REQUEST>
  <LOGIN authenticationkey='${process.env.TRAFIKVERKET_API_KEY}' />
     <QUERY objecttype='TrainAnnouncement' lastmodified='true' orderby='AdvertisedTimeAtLocation'>
      <FILTER>
       <AND>
         <IN name='ProductInformation' value='Pendeltåg' />
         <LIKE name='AdvertisedTrainIdent' value='/[${
           direction === 'n' ? '02468' : '13579'
         }]$/' />
         <OR>
           <AND>
            <GT name='AdvertisedTimeAtLocation' value='$dateadd(-0:12:00)' />
            <LT name='AdvertisedTimeAtLocation' value='$dateadd(0:12:00)' />
           </AND>
           <AND>
            <GT name='EstimatedTimeAtLocation' value='$dateadd(-0:12:00)' />
            <LT name='EstimatedTimeAtLocation' value='$dateadd(0:12:00)' />
           </AND>
           <AND>
            <GT name='TimeAtLocation' value='$dateadd(-0:12:00)' />
            <LT name='TimeAtLocation' value='$dateadd(0:12:00)' />
           </AND>
         </OR>
       </AND>
      </FILTER>
      <INCLUDE>ActivityType</INCLUDE>
      <INCLUDE>AdvertisedLocationName</INCLUDE>
      <INCLUDE>AdvertisedShortLocationName</INCLUDE>
      <INCLUDE>AdvertisedTrainIdent</INCLUDE>
      <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
      <INCLUDE>Geometry</INCLUDE>
      <INCLUDE>LocationSignature</INCLUDE>
      <INCLUDE>TimeAtLocation</INCLUDE>
      <INCLUDE>ToLocation</INCLUDE>
     </QUERY>
</REQUEST>`
}
