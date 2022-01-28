function WeatherInfo(props) {
  const { weather } = props

  return (
    <div className="WeatherInfo">
      {weather ? <h1>{weather.data.getWeatherByZip.temperature}</h1> : null}
    </div>
  );
}

export default WeatherInfo