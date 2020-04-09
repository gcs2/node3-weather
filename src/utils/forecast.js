const request = require('request')
const forecast = (longitude, latitude, callback) => {
    const url = `https://api.darksky.net/forecast/8a299d94b89cfde87a95ee77796d2389/${latitude},${longitude}`
    request({url, json: true}, (error, { body }) => {
        if(error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.error) {
            callback(body.error, undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' 
                     + body.currently.temperature + ' degrees, with a ' 
                     + body.currently.precipProbability * 100 + 
                     '% chance of precipitation. Humidity is ' + body.currently.humidity * 100 +
                     '%. The winds are traveling ' + body.currently.windSpeed + 'mph.')
        }
    }) 
}

module.exports = forecast;