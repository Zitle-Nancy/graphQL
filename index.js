import { ApolloServer, gql } from "apollo-server";

const persons = [
  {
    name: "Midu",
    phone: "034-1234567",
    street: "Calle Frontend",
    city: "Barcelona",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Youseff",
    phone: "044-123456",
    street: "Avenida Fullstack",
    city: "Mataro",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Itzi",
    street: "Pasaje Testing",
    city: "Ibiza",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

const typeDefinitions = gql`
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]
    findPerson(name: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
});

// iniciar el servidor, run: node index.js
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// NOTES
/**
 *  Query, para definir las peticiones que queremos hacer
 *  personCount y allPerson son las queries que vamos a utilizar
 *  se pueden utilizar los types que hemos creado, en este caso Person, en la query de allPersons
 *  GraphQl tiene dos variantes: las definiciones (typeDefs) y de donde obtiene esos datos (Resolvers)
 *  Para crear nuestro servidor con apollo debemos pasarle dos parametros (que son palabras reservadas): typeDefs and resolvers
 * */
