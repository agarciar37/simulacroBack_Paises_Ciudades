import { AirQualityAPI, CityAPI, CountryAPI, WheaterAPI, WorldTimeAPI } from "./types.ts";

export const getCountryName = async (code: string): Promise<CountryAPI> => {
    const API_KEY = Deno.env.get("API_KEY")
    if (!API_KEY) throw new Error("API_KEY is not defined");
    const url  =`https://api.api-ninjas.com/v1/country?name=${code}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Failed to fetch geo data");
    return await response.json()
}

export const getCityData = async(city: string): Promise<Array<{
    latitude: string, 
    longitude: string, 
    country: string, 
    population: number, 
    is_capital: boolean,
    air_quality: number,
    localTime: string
}>> => {
    const API_KEY = Deno.env.get("API_KEY")
    if (!API_KEY) throw new Error("API_KEY is not defined");
    const url  =`https://api.api-ninjas.com/v1/city?name=${city}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Failed to fetch data");
    const data: CityAPI = await response.json()
    const result = await Promise.all(
        data.map(async (city) => {
            const countryData = await getCountryName(city.country);
            // Adjust this line to extract the country name string from countryData
            // For example, if countryData[0].name is the country name:
            const country = Array.isArray(countryData) && countryData.length > 0 ? countryData[0].name : "";
            const air_quality = await getAirQuality(city.latitude, city.longitude);
            const localTime = await getWorldTime(city.latitude, city.longitude);
            return {latitude: city.latitude, longitude: city.longitude, country, population: city.population, is_capital: city.is_capital, air_quality, localTime}
        })
    )
    return result;
}

export const getTemperature = async(
    lat: string,
    lon: string
): Promise<number> => {
    const API_KEY = Deno.env.get("API_KEY")
    if (!API_KEY) throw new Error("API_KEY is not defined");
    const url  =`https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`
    const response = await fetch(url, {
        headers: {
            "X-Api-Key": API_KEY
        }
    })
    if (!response.ok) throw new Error("Failed to fetch data")
    const data: WheaterAPI = await response.json()
    return data.temp
}

export const getAirQuality = async (lat: string, lon: string): Promise<number> => {
    const API_KEY = Deno.env.get("API_KEY")
    if (!API_KEY) throw new Error("API_KEY is not defined");
    const url = `https://api.api-ninjas.com/v1/airquality?lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
        headers: {
        "X-Api-Key": API_KEY
        },
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    const data: AirQualityAPI = await response.json();
    return data.overall_aqi;
};

export const getWorldTime = async(lat: string, lon: string): Promise<string> => {
  const API_KEY = Deno.env.get("API_KEY");
  if (!API_KEY) throw new Error("API_KEY is not defined");

  const url = `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`;
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  if (!response.ok) throw new Error("Failed fetching data");

  const data: WorldTimeAPI = await response.json();
  return data.dateTime;
};

