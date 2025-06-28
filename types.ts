import { ObjectId, OptionalId } from "mongodb"

export type CountryModel = OptionalId<{
    name: string;
    capital: string;
    cities: ObjectId[]
}>

export type CityModel = OptionalId<{
    name: string;
    is_capital: boolean;
    latitude: string;
    longitude: string;
}>

export type WheaterAPI = {
    temp: number;
}

export type WorldTimeAPI = {
    dateTime: string;
}

export type CityAPI = Array<{
    name: string;
    latitude: string;
    longitude: string;
    country: string;
    population: number;
    is_capital: boolean;
}>

export type CountryAPI = Array<{
    name: string;
    capital: string;
}>

export type AirQualityAPI = {
    overall_aqi: number;
}