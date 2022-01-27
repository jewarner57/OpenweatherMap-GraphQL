require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require('node-fetch')

// Challenge List:
// https://github.com/Tech-at-DU/ACS-4390-Query-Languages/blob/master/Lessons/Lesson-3.md

// Define the Schema
const schema = buildSchema(`
type Weather {
  temperature: Float
  description: String
  feels_like: Float
  temp_min: Float
  temp_max: Float
  pressure: Float
  humidity: Float
  status: String
  message: String
  locationName: String
}

type Query {
  getWeatherByZip(zip: Int!, units: Units): Weather!
  getWeatherByCityName(cityName: String!, units: Units): Weather!
  getWeatherByCoords(lat: Float!, lon: Float!, units: Units): Weather!
}

enum Units {
  standard
  metric
  imperial
}

`)

// Define a Resolver
const root = {
  getWeatherByZip: async ({ zip, units = 'imperial' }) => {
    return await makeAPIRequest(`
    https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=${units}`)
  },
  getWeatherByCityName: async ({ cityName, units = 'imperial' }) => {
    return await makeAPIRequest(`
    https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}`)
  },
  getWeatherByCoords: async ({ lon, lat, units = 'imperial' }) => {
    return await makeAPIRequest(`
    https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&units=${units}`)
  },
}

const makeAPIRequest = async (url) => {
  const apikey = process.env.OPENWEATHERMAP_API_KEY
  const fullUrl = `${url}&appid=${apikey}`
  const res = await fetch(fullUrl)
  const json = await res.json()

  if (json.cod !== 200) {
    return { message: json.message, status: json.cod }
  }

  const temperature = json.main.temp
  const name = json.name
  const description = json.weather[0].description
  const cod = String(json.cod)
  return { locationName: name, temperature, description, ...json.main, status: cod }
}

// Create express app
const app = express()

// Define the route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

// Start the app
const port = 3001
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})