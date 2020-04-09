const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App bb',
        name: "Geoff Salmon"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Bruh',
        name: 'My name is Geoff',
        lil_text: "The fitnessgram pacer test"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Opioid addiction, pharmacy the real trap',
        name: 'Geoff Salmon'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }
    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
        if(error) {
            return res.send({ error })
        } else {
            forecast(longitude, latitude, (error, {currTemp, currPrecipProbability}) => {
                if(error) {
                    return res.send({ error })
                } else {
                    const currPrecipPercentage = currPrecipProbability * 100
                    return res.send({
                        forecast: `It is currently ${currTemp} degrees F, with a ${currPrecipPercentage}% chance of rain.`,
                        location,
                        address: req.query.address
                    })                }
            })
        }
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help article not found',
        name: 'Vince Carter'
    })
})

// 404 page, needs to come last!
app.get('*', (req, res) => {
    res.render('404', {
        title: 'Never should have come here!',
        name: 'Ulfric Stormcloak, Jarl of Windhelm'
    })   
})

app.listen(port, () => {
    console.log('The server is up on port ' + port)
})