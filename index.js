import { ApolloServer, gql, UserInputError } from "apollo-server";

import "./db.js";
import Person from "./models/person.js";

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

    editNumber(name: String!, phone: String!): Person
  }
`;

// Server
const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (_, args) => {
      if (!args.phone) return Person.find({});
      return Person.find({ phone: { $exists: args.phone === "YES" } });
    },
    findPerson: (root, args) => {
      const { name } = args;
      return Person.findOne({ name });
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = new Person({ ...args });
      return person.save();
    },
    editNumber: async (_, args) => {
      const person = await Person.findOne({ name: args.name });
      // keep in main if we need to return null
      if (!person) return null;

      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return person;
    },
  },
  Person: {
    // we're modifying the original person type of Persons, thanks to root we're creating the address obj
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
