import React, { useState, useEffect } from "react";
export default function App() {
  const url = "https://studies.cs.helsinki.fi/restcountries/api/all";

  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      });
  }, []);

  return (
    <div>
      <h1>Maiden tiedot</h1>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries countries={countries} filter={filter} />
    </div>
  );
}

const Countries = ({ countries, filter }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (filteredCountries.length === 1) {
    return (
      <>
        <h2>{country.name.common}</h2>
        <CountryDetails country={filteredCountries[0]} />;
      </>
    );
  }
  return filteredCountries.map((country) => (
    <Country key={country.name.common} country={country} />
  ));
};

const Country = ({ country }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <h2>{country.name.common}</h2>
      <button onClick={() => setShow(!show)}>{show ? "hide" : "show"}</button>
      {show && <CountryDetails country={country} />}
    </div>
  );
};

const CountryDetails = ({ country }) => {
  return (
    <div>
      <p>capital {country.capital[0]}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag" width="200" />
      <Weather country={country} />
    </div>
  );
};

const Weather = ({ country }) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${import.meta.env.VITE_API_KEY}`;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
      });
  }, [setWeather]);

  if (weather) {
    return (
      <div>
        <h3>Weather in {country.capital[0]}</h3>
        <p>temperature: {weather.main.temp - 273.15} Celsius</p>
        <p>wind: {weather.wind.speed} m/s</p>
        <p>humidity: {weather.main.humidity} %</p>
      </div>
    );
  }
  return <p>Weather data not available</p>;
};

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      find countries{" "}
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};
