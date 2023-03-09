import { gql } from '@apollo/client';

export const TABLES_SUBSCRIPTION = gql`
subscription TablesSubscription {
  tables {
    id
    name
    type
    activeMatch {
      endTime
      id
      otCount
      startTime
      teamOneCups
      teamTwoCups
      team1 {
        id
        name
        players {
          firstName
          id
          lastName
          stats {
            record {
              losses
              wins
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
      team2 {
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
    }
  }
}
`;

export const TOURNAMENT_MATCHES_SUBSCRIPTION = gql`
subscription MatchesByTournamentSubscription($tournamentId: ID!) {
  tournamentMatches(tournamentId: $tournamentId) {
    id
    startTime
    endTime
    otCount
    teamOneCups
    teamTwoCups
    team1 {
      id
      name
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
    team2 {
      id
      name
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
  }
}
`;