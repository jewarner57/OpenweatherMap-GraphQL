import { useState } from 'react'
import { gql } from '@apollo/client'
import { client } from './index'
import WeatherInfo from './WeatherInfo'
import './Weather.css'

function Weather() {
  const [weather, setWeather] = useState('')
  const [zip, setZip] = useState('')
  const [unit, setUnit] = useState('F')
  const units = {
    'C': 'metric',
    'K': 'standard',
    'F': 'imperial',
  }

  async function getWeather() {
    try {
      const json = await client.query({
        query: gql`
        query {
          getWeatherByZip(zip:${zip}, units:${units[unit]}) {
          temperature
          temp_min
          temp_max
          locationName
          description
          status
          message
        }
      }
      `
      })
      setWeather(json)
    } catch (err) {
      console.log(err.message)
      setWeather({ data: { getWeatherByZip: { cod: '400', message: err.message } } })
    }
  }

  return (
    <div className="Weather">
      {weather ? <WeatherInfo weather={weather} /> : ""}

      <form onSubmit={(e) => {
        e.preventDefault()
        getWeather()
      }}>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder='Zipcode'
        />
        <select name="unit" onChange={(e) => { setUnit(e.target.value) }} value={unit}>
          <option value="F">F</option>
          <option value="C">C</option>
          <option value="K">K</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Weather