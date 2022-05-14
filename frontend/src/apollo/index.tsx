import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const GRAPH_URI = `${process.env.REACT_APP_SERVER_URL || ''}/graphql/`;
const httpLink = new HttpLink({
  uri: GRAPH_URI,
  credentials: 'include',
});

let WS_URI = GRAPH_URI.replace('http', 'ws');
if (process.env.REACT_APP_WS_PATH) {
  WS_URI = WS_URI.replace('graphql', process.env.REACT_APP_WS_PATH);
}
const wsLink = new GraphQLWsLink(createClient({
  url: WS_URI,
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

const ApolloWrapper: React.FC<{ children: any }> = ({ children }) => (
  <ApolloProvider client={client}>{ children }</ApolloProvider>
);

export default ApolloWrapper;
