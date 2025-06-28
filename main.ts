import { MongoClient } from "mongodb";
import { CityModel, CountryModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { typeDefs } from "./schema.ts";
import { ApolloServer } from "@apollo/server";

const MONGO_URL = "mongodb+srv://agarciar37:<db_password>@cluster0.nv27ans.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

if (!MONGO_URL) throw new Error("MONGO_URL is not defined");

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect()

console.info("Connected to mongoDB")

const mongoDB = mongoClient.db("Simulacro_Paises_Ciudades")
const CountriesCollection = mongoDB.collection<CountryModel>("countries")
const CitiesCollection = mongoDB.collection<CityModel>("cities")

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({
    CountriesCollection,
    CitiesCollection, // ✅ Incluido en el contexto
  }),
});

console.info(`Server ready at ${url}`);

