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
}

type Query {
  getWeather(zip: Int!, units: Units): Weather!
}

enum Units {
  standard
  metric
  imperial
}

`)

// Define a Resolver
const root = {
  getWeather: async ({ zip, units = 'imperial' }) => {
    const apikey = process.env.OPENWEATHERMAP_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
    const res = await fetch(url)
    const json = await res.json()

    if (json.cod === 200) {
      const temperature = json.main.temp
      const description = json.weather[0].description
      const cod = String(json.cod)
      return { temperature, description, ...json.main, status: cod }
    }
    else {
      return { message: json.message, status: json.cod }
    }
  }
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