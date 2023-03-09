export interface User {
  id: number,
  number: string,
  player: any,
  admin: boolean,
  team: Team | undefined,
}

export interface UserShort {
  id: number,
  full_name: string,
}

export interface Player {
  id: number,
  firstName: string,
  lastName: string,
  stats: any
}

export interface SpotifyTrack {
  track: string,
  artist: string,
  album: string,
  id: string,
  imageUrl: string,
  lengthMillis: number,
}

export interface Tournament {
  id: number
  type: string
  desc: string
  name: string
  teams: Team[]
  logoUrl: string
  location: string
  teamSize: number
  enrollTime: Date
  startTime: Date
  endTime: Date
}

export interface Team {
  id: number
  name: string
  players: Player[]
  song: Song
}

export interface Song {
  id: string
  name: string
  image: string
  start: string
  artist: string
  duration: string
}

export interface Match {
  id: number
  endTime?: Date
  otCount?: number
  startTime?: number
  teamOneCups?: number
  teamTwoCups?: number
  team1: Team
  team2: Team
}

export interface Table {
  id: number
  name: string
  type: string
  activeMatch: Match
}
