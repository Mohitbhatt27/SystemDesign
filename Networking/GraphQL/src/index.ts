import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"

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
  type Mutation {
    addBook(title: String!, publishedYear: Int!, authorId: ID!): Book!
    updateBook(id: ID!, title: String, publishedYear: Int, authorId: ID): Book
    deleteBook(id: ID!): Boolean!
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
    }},

  Query: {
    authors: () => data.authors,
    books: () => data.books,
  },

  Mutation: {
    addBook: (parent, { title, publishedYear, authorId }, context, info) => {
      const newBook = {
        id: String(data.books.length + 1),
        title,
        publishedYear,
        authorId
      };
      data.books.push(newBook);
      return newBook;
    },
    updateBook: (parent, { id, title, publishedYear, authorId }, context, info) => {
      const book = data.books.find(book => book.id === id);
      if (!book) {
        throw new Error("Book not found");
      }
      if (title !== undefined) book.title = title;
      if (publishedYear !== undefined) book.publishedYear = publishedYear;
      if (authorId !== undefined) book.authorId = authorId;
      return book;
    },
    deleteBook: (parent, { id }, context, info) => {
      const bookIndex = data.books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error("Book not found");
      }
      data.books.splice(bookIndex, 1);
      return true;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

/**
 * Passing the apollo server instance to the `startStandAloneServer` function:
 * 1. creates an Express app
 * 2. installs our ApolloServer instance as middleware
 * 3. Prepares our app tp handle incoming requests
 */

const { url } = await startStandaloneServer (server, {
  listen: {
    port: 4000
  }
})

console.log(`🚀  Server ready at: ${url}`);