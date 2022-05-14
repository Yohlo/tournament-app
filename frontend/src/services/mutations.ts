import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($number: String!) {
    login(number: $number) {
      ... on LoginSuccess {
        user {
          admin
          id
          number
          lastActivity
          registrationDate
          player {
            id
            firstName
            lastName
          }
        }
      }
      ... on LoginError {
        message
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout
  }
`;
