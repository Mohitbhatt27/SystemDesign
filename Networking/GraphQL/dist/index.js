import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
/**
 * A schema is a collection of type definitions (hence "typeDefs") that together define the "shape" of the queries that are executed against our data.
 */
const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    books: [Book!]!
}
  type Book {
    id: ID!
    title: String!
    publishedYear: Int!
    author: Author!
}
    type Query {
    authors: [Author!]!
    books: [Book!]!
}
`;
const data = {
    authors: [
        { id: "1", name: "Chirag Goel", bookIds: ["101", "102"] },
        { id: "2", name: "Akshay Saini", bookIds: ["103"] },
    ],
    books: [
        { id: "101", title: "Namaste Frontend System Design", publishedYear: 2000, authorId: "1" },
        { id: "102", title: "Book 2", publishedYear: 2010, authorId: "1" },
        { id: "103", title: "Book 3", publishedYear: 2020, authorId: "2" },
    ],
};
const resolvers = {
    Book: {
        author: (parent, args, context, info) => {
            return data.authors.find(author => author.id === parent.authorId);
        }
    },
    Author: {
        books: (parent, args, context, info) => {
            return data.books.filter(book => book.authorId === parent.id);
        }
    },
    Query: {
        authors: () => data.authors,
        books: () => data.books,
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
/**
 * Passing the apollo server instance to the `startStandAloneServer` function:
 * 1. creates an Express app
 * 2. installs our ApolloServer instance as middleware
 * 3. Prepares our app tp handle incoming requests
 */
const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000
    }
});
console.log(`🚀  Server ready at: ${url}`);
