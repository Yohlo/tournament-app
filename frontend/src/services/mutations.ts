import { gql } from '@apollo/client';


export const START_LOGIN = gql`
  mutation StartLogin($number: String!) {
    startVerify(number: $number)
  }
`;

export const VERIFY_LOGIN = gql`
  mutation CheckLogin($number: String!, $code: String!) {
    checkVerify(code: $code, number: $number) {
      ... on LoginSuccessWithPlayer {
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
            stats {
              record {
                wins
                losses
              }
            }
          }
        }
      }
      ... on LoginSuccessWithoutPlayer {
        user {
          admin
          id
          number
          lastActivity
          registrationDate
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

export const UPDATE_USER_PLAYER = gql`
  mutation UpdateUserPlayer($userId: ID!, $playerId: ID!) {
    updateUserPlayer(userId: $userId, playerId: $playerId) {
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
`;

export const NEW_PLAYER_FOR_USER = gql`
  mutation NewPlayerForUser($userId: ID!, $firstName: String!, $lastName: String!) {
    newPlayerForUser(userId: $userId, firstName: $firstName, lastName: $lastName) {
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
`;

export const NEW_TEAM = gql`
mutation CreateTeam($team: TeamInput!) {
  createTeam(team: $team) {
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
`;

export const EDIT_TEAM = gql`
mutation EditTeam($id: ID!, $team: TeamInput!) {
  editTeam(id: $id, team: $team) {
    id
    name
    players {
      firstName
      id
      lastName
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
`;

export const ENTER_TEAM = gql`
mutation TeamEntry($teamId: ID!, $tournamentId: ID!) {
  __typename
  teamEntry(teamId: $teamId, tournamentId: $tournamentId)
}`;

export const CREATE_MATCH = gql`
  mutation CreateMatch($match: MatchCreateInput!) {
    createMatch(match: $match) {
      endTime
      id
      otCount
      startTime
      teamOneCups
      teamTwoCups
    }
  }
`;

export const END_MATCH = gql`
  mutation EndMatch($matchId: ID!, $match: MatchEndInput!) {
    endMatch(matchId: $matchId, match: $match) {
      endTime
      id
      otCount
      startTime
      teamOneCups
      teamTwoCups
    }
  }
`;
