function WeatherInfo(props) {
  const { weather: { data: { getWeatherByZip } } } = props
  const weather = getWeatherByZip

  return (
    <div className="WeatherInfo">
      {weather.status === '200' ?
        <div>
          <h3>{weather.locationName}</h3>
          <h1>{weather.temperature}</h1>
          <p>Low: {weather.temp_min}</p>
          <p>High: {weather.temp_max}</p>
        </div>
        :
        <h1>{weather.message}</h1>
      }
    </div >
  );
}

export default WeatherInfo