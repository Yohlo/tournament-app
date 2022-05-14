import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      admin
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
`;

export const ALL_USERS = gql`
  query AllUsers {
    users {
      id
      admin
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
`;