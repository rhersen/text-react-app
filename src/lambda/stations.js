const request = require('request')

export function handler({ queryStringParameters }, context, callback) {
  request.post(
    'http://api.trafikinfo.trafikverket.se/v1.2/data.json',
    {
      body: getBody(),
      headers: {
        'Content-Type': 'application/xml',
      },
    },
    (error, res) => {
      if (error) {
        callback(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      callback(null, {
        statusCode: 200,
        body: res.body,
      })
    }
  )
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
