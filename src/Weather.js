import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './index'
import WeatherInfo from './WeatherInfo'


function Weather() {
  const [weather, setWeather] = useState('')
  const [zip, setZip] = useState('')

  async function getWeather() {
    try {
      const json = await client.query({
        query: gql`
        query {
          getWeatherByZip(zip:${zip}) {
          temperature
          description
        }
      }
      `
      })
      setWeather(json)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className="Weather">
      <WeatherInfo weather={weather} />

      <form onSubmit={(e) => {
        e.preventDefault()
        getWeather()
      }}>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Weather