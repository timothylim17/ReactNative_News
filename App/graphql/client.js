import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";

const restLink = new RestLink({
  uri: "https://newsapi.org/v2/",
  headers: {
    Authorization: "7d1cf2b9c6d04e6c8dc1115f31d6c1ea",
  },
});

export const client = ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});
