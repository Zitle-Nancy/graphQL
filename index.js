import { ApolloServer, gql } from "apollo-server";
import { GraphQLError } from "graphql";
import { v1 as uuid } from "uuid";

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
  enum YesNo {
    YES
    NO
  }

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
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;

// Server
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (_, args) => {
      if (!args.phone) return persons;

      return persons.filter((person) => {
        return args.phone === "YES" ? person.phone : !person.phone;
      });
    },
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((person) => person.name === args.name)) {
        throw new GraphQLError("Name must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const person = { ...args, id: uuid() };
      persons.push(person); // update our person JSON ~ update database with new person
      return person;
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
