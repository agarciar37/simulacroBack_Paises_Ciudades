import { Collection, ObjectId } from "mongodb";
import { CityModel, CountryModel } from "./types.ts";
import { getCityData, getCountryName, getTemperature } from "./utils.ts";

type Context = {
    CountriesCollection: Collection<CountryModel>
    CitiesCollection: Collection<CityModel>
}

type AddCountryArgs = {
    name: string;
    city: string[]
}

export const resolvers = {
    Country: {
        id: (parent: CountryModel) => parent._id!.toString(),
        capital: async(parent: CountryModel) => {
            const {name} = parent;
            const country = await getCountryName(name);
            return country[0].capital;
        },
        cities: async (parent: CountryModel, _: unknown, context: Context) => {
            return await context.CitiesCollection.find({
                _id: {$in: parent.cities},
            }).toArray()
        }
    },
    City: {
        id: (parent: CityModel) => parent._id!.toString(),
        is_capital: async(parent: CityModel) => {
            const {name} = parent;
            const cityData = await getCityData(name);
            return cityData[0].is_capital;
        },
        temperature: async(parent: CityModel) => {
            const {latitude, longitude} = parent;
            return await getTemperature(latitude, longitude);
        }, 
        population: async(parent: CityModel) => {
            const {name} = parent;
            const cityData = await getCityData(name);
            return cityData[0].population;
        },
        air_quality: async(parent: CityModel) => {
            const {name} = parent;
            const cityData = await getCityData(name);
            return cityData[0].air_quality;
        },
        dateTime: async(parent: CityModel) => {
            const {name} = parent;
            const cityData = await getCityData(name);
            return cityData[0].localTime;
        }
    },
    Query: {
        getCountries: async(_: unknown, __: unknown, context: Context): Promise<CountryModel[]> => {
            return await context.CountriesCollection.find().toArray();
        },
        getCountry: async(_: unknown, {id}: {id: string}, context: Context): Promise<CountryModel | null> => {
            return await context.CountriesCollection.findOne({_id: new ObjectId(id)});
        }
    },
    Mutation: {
        addCountry: async (_:unknown, {name, city}: AddCountryArgs, context: Context) => {
            const countryData = await getCountryName(name)
            if (!countryData || countryData.length === 0) {
                throw new Error("Country not found");
            }

            const cityObjects = await Promise.all(
                city.map(async (c) => {
                const citiesFound = await getCityData(c);
                if (citiesFound.length === 0) {
                    throw new Error(`City "${c}" not found`);
                }
                const selected = citiesFound[0];
                return {
                    name: c,
                    is_capital: selected.is_capital,
                    latitude: selected.latitude,
                    longitude: selected.longitude,
                };
                })
            );

            // ✅ Usa la colección del contexto
            const insertResult = await context.CitiesCollection.insertMany(cityObjects);
            const insertedIds = Object.values(insertResult.insertedIds);

            const newCountry: CountryModel = {
                name,
                capital: countryData[0].capital,
                cities: insertedIds,
            };

            const { insertedId } = await context.CountriesCollection.insertOne(newCountry);

            return {
                _id: insertedId,
                ...newCountry,
            };
        }
    }
}