export const typeDefs = `#graphql
    type Country {
        id: ID!
        name: String!
        capital: String!
        cities: [City!]!
    }

    type City {
        id: ID!
        name: String!
        is_capital: Boolean!
        temperature: Int!
        population: Int!
        air_quality: Int!
        dateTime: String
    }

    type Query {
        getCountries: [Country!]!
        getCountry(id: ID!): Country
    }

    type Mutation {
        addCountry(name: String!, city: [String!]!): Country
    }
`