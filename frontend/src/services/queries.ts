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
        stats {
          record {
            wins
            losses
          }
        }
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
        stats {
          record {
            wins
            losses
          }
        }
      }
    }
  }
`;

export const ALL_PLAYERS = gql`
  query AllPlayers {
    players {
      id
      firstName
      lastName
      stats {
        record {
          wins
          losses
        }
      }
    }
  }
`;

export const UNASSOCIATED_PLAYERS = gql`
  query UnassociatedPlayers {
    unassociatedPlayers {
      id
      firstName
      lastName
    }
  }
`;

export const FREE_AGENTS = gql`
  query FreeAgents($tournamentId: ID!) {
    freeAgents(tournamentId: $tournamentId) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_TOURNAMENTS = gql`
query Tournaments {
  tournaments {
    type
    teams {
      id
      name
      players {
        firstName
        id
        lastName
        stats {
          record {
            wins
            losses
          }
        }
      }
      song {
        artist
        duration
        id
        image
        name
        start
      }
    }
    teamSize
    startTime
    name
    logoUrl
    location
    id
    enrollTime
    endTime
    desc
  }
}`;

export const GET_PLAYERS = gql`
query Players {
  players {
    firstName
    id
    lastName
    stats {
      record {
        wins
        losses
      }
    }
  }
}`;
