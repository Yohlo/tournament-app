import { gql } from '@apollo/client';

export const USERS_SUBSCRIPTION = gql`
subscription Users {
  users {
    id,
    admin,
    number,
    lastActivity,
    registrationDate,
    player {
      id,
      lastName,
      firstName
    }
  }
}
`;
