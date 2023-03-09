import { OperationVariables, QueryResult, useQuery } from '@apollo/client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { GET_PLAYERS, GET_TOURNAMENTS, ME } from '../../services/queries';
import { UserShort, User, Tournament, Team } from '../../types';
import { useUser } from '../User';


interface TournamentContextType {
    tournament: Tournament | undefined
    setTournament: React.Dispatch<React.SetStateAction<Tournament | undefined>> | undefined
    players: UserShort[]
    setPlayers: React.Dispatch<React.SetStateAction<UserShort[]>> | undefined
    user: User | undefined
    setUser: React.Dispatch<React.SetStateAction<User | undefined>> | undefined,
    tournamentsQuery: QueryResult<any, OperationVariables> | undefined,
    playerQuery: QueryResult<any, OperationVariables> | undefined,
}

interface TournamentData {
    tournament: Tournament | undefined,
    tournaments: Tournament[],
    players: UserShort[],
    user: User | undefined,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>> | undefined,
    loading: boolean,
}

// eslint-disable-next-line object-curly-newline
export const TournamentContext = createContext<TournamentContextType>({ tournament: undefined, setTournament: undefined, players: [], setPlayers: undefined, user: undefined, setUser: undefined, tournamentsQuery: undefined, playerQuery: undefined });

export const useTournament: () => TournamentData = () => {
    const { tournament, setTournament, players, setPlayers, user, setUser, tournamentsQuery, playerQuery } = useContext(TournamentContext);
    const [loading, setLoading] = useState(false);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    
    useEffect(() => {
        if (tournamentsQuery && playerQuery) {
            let new_loading = tournamentsQuery.loading || playerQuery.loading;
            if (new_loading !== loading) {
                setLoading(new_loading);
            }
        }
    }, [tournamentsQuery, playerQuery])

    useEffect(() => {
        let data = tournamentsQuery?.data;
        let loading = tournamentsQuery?.loading;
        if (data?.tournaments?.length && !loading && setTournaments) {
            setTournaments(data.tournaments.sort((a: Tournament, b: Tournament) => (
                new Date(b.startTime).getTime()- new Date(a.startTime).getTime()
            )));
        }
    }, [tournamentsQuery?.data, tournamentsQuery?.loading, setTournaments]);

    useEffect(() => {
        if (tournaments.length && setTournament) {
            setTournament(tournaments[0]);
            document.title = tournaments[0].name;
        }
    }, [tournaments, setTournament]);

    useEffect(() => {
        let data = playerQuery?.data;
        let loading = playerQuery?.loading;
        if (data?.players?.length && loading && setPlayers) {
            setPlayers(data?.players.map((p: any) => ({
                id: p.id,
                full_name: `${p.firstName} ${p.lastName}`
            })));
        }
    }, [playerQuery?.data, playerQuery?.loading, setPlayers]);

    useEffect(() => {
        if (user?.team) {
            return;
        }
        if (user && tournament && tournament.teams && setUser) {
            let team = tournament.teams.find((team: Team) => team.players.some(p => p.id === user.player?.id));
            if (team) {
                setUser({
                    ...user,
                    team
                });
            } else {
                // Look for last team
                const ts = tournaments.filter((t: Tournament) => t.id !== tournament.id);
                if (ts.length && user.player) {
                    let lastTournament: Tournament = ts[0];
                    let team = lastTournament?.teams?.find((team: Team) => team.players.some(p => p.id === user?.player?.id));
                    if (team) {
                        setUser({
                            ...user,
                            team
                        });
                    }
                }
            }
        }
    }, [user, tournament, tournaments, setUser]);

    return {
        tournament,
        tournaments,
        players,
        user,
        setUser,
        loading: !!(tournamentsQuery?.loading || playerQuery?.loading)
    };
};


export const TournamentProvider: React.FC<{ children: any }> = ({ children }: any) => {
    const tournamentsQuery = useQuery(GET_TOURNAMENTS);
    const playerQuery = useQuery(GET_PLAYERS);
    const [tournament, setTournament] = useState<Tournament | undefined>();
    const [players, setPlayers] = useState<UserShort[]>([]);
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const data = {
        tournament,
        setTournament,
        players,
        setPlayers,
        user,
        setUser,
        loading,
        setLoading,
        tournamentsQuery,
        playerQuery
    };

    if (loading) {
        return (
          <div
            style={{
              paddingTop: '30vh'
            }}
          >
            <Loader />
          </div>
        );
    }

    return (
        <TournamentContext.Provider value={data}>
            {children}
        </TournamentContext.Provider>
    );
  };
  