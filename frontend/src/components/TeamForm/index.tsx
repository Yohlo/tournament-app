import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import PeoplePicker from '../PeoplePicker';
import TextBox from '../TextBox';
import Button from '../Button';
import { useToasts } from '../../hooks';
import { getSpotifyTrackAsync } from '../../services/api';
import { Team, UserShort, SpotifyTrack, Player } from '../../types';
import SongPicker from '../SongPicker';
import TimestampPicker from '../TimeStampPicker';
import DurationPicker from '../DurationPicker';
import styles from './styles.module.css';
import { EDIT_TEAM, ENTER_TEAM, NEW_TEAM } from '../../services/mutations';
import { FREE_AGENTS } from '../../services/queries';
import { useTournament } from '../../contexts/Tournament';

const EDIT = 'edit';
const CREATE = 'creat';

interface Props {
    initialTeam?: Team,
}

const TeamForm: React.FC<Props> = ({ initialTeam }: Props) => {
    const [name, setName] = useState<string>(initialTeam?.name || '');
    const { user, tournament, setUser } = useTournament();
    const team_size = 2;
    const { data } = useQuery(FREE_AGENTS, {
        variables: {
            tournamentId: tournament?.id
        }
    });
    const [teamPlayers, setTeamPlayers] = useState<(UserShort | undefined)[]>(
        initialTeam?.players?.length ?
            initialTeam.players.map(p => ({
                id: p.id,
                full_name: p.firstName + ' '  + p.lastName
            })) :
            [...Array(team_size)].map(_ => undefined)
    );
    const [walkoutSong, setWalkoutSong] = useState<SpotifyTrack>();
    const [timestamp, setTimestamp] = useState<string>(initialTeam?.song?.start || '0:00');
    const [duration, setDuration] = useState<string>(initialTeam?.song?.duration || '0:10');
    const [active, setActive] = useState<string>('');
    const [createTeam] = useMutation(NEW_TEAM);
    const [editTeam] = useMutation(EDIT_TEAM);
    const [enterTeam] = useMutation(ENTER_TEAM);
    const { successToast, errorToast } = useToasts();
    const navigate = useNavigate();
    const isAdmin: boolean = !!user && user.admin;
    const [verb, setVerb] = useState(initialTeam ? EDIT : CREATE);
    const [players, setPlayers] = useState<UserShort[]>([]);

    useEffect(() => {
        if (data?.freeAgents?.length && !players.length) {
            setPlayers([ ...data.freeAgents.map((p: any) => ({
                id: p.id,
                full_name: `${p.firstName} ${p.lastName}`
            })), ]);
        }
      }, [data, players]);

    useEffect(() => {
        setVerb(initialTeam ? EDIT : CREATE);
    }, [initialTeam])

    useEffect(() => {
        if (verb === EDIT && initialTeam?.players?.length && teamPlayers.length && teamPlayers[0]) {
            if (initialTeam.players.map((p: Player) => p.id).every((id: number) => !teamPlayers.map((d: any) => d?.id).includes(id))) {
                setVerb(CREATE);
            }
        }
    }, [verb, initialTeam, teamPlayers]);

    useEffect(() => {
        if (!players.length) {
            return;
        }
        if (verb === CREATE) {
            setName('')
            if (user?.player && !user.admin) {
                setTeamPlayers([{
                    id: user.player.id,
                    full_name: user.player.firstName + ' ' + user.player.lastName,
                },
                ...[...Array(team_size - 1)].map(_ => undefined)
            ]);
            } else {
                setTeamPlayers([...Array(team_size)].map(_ => undefined));
            }
            setWalkoutSong(undefined)
            setTimestamp('0:00');
            setDuration('0:10');
        } else if (initialTeam) {
            setName(initialTeam.name)
            setTeamPlayers(initialTeam.players?.length ?
                initialTeam.players.map(p => ({
                    id: p.id,
                    full_name: p.firstName + ' '  + p.lastName
                })) :
                [...Array(team_size)].map(_ => undefined)
            );
            if (initialTeam.song?.id) {
                getSpotifyTrackAsync(initialTeam.song?.id).then(setWalkoutSong);
            }
            setTimestamp(initialTeam?.song?.start || '0:00');
            setDuration(initialTeam?.song?.duration || '0:10');
        }
    }, [players, initialTeam, verb]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const teamMutation = verb === EDIT ? editTeam : createTeam;
        const response = await teamMutation({
            variables: {
                id: initialTeam?.id,
                team: {
                    name,
                    players: teamPlayers.map(p => String(p?.id)),
                    song: {
                        id: walkoutSong?.id,
                        name: walkoutSong?.track,
                        artist: walkoutSong?.artist,
                        start: timestamp,
                        duration: duration,
                        image: walkoutSong?.imageUrl,
                    }
                },
            },
        });

        if (!response.data) {
            errorToast(`Unknown error ${verb}ing team.`);
            return;
        }

        const team: any = verb === 'edit' ? response.data.editTeam : response.data.createTeam;
        if (team && user && team.players.find((p: Player) => p.id === user.player?.id) && setUser) {
            setUser({
                ...user,
                team
            });
        }
        if (team && user && tournament && !tournament.teams.some((t: Team) => t.id === team.id)) {
            enterTeam({
                variables: {
                    teamId: team.id,
                    tournamentId: tournament.id
                },
            }).then(response => {
                if (response.data.teamEntry) {
                    successToast(`Team ${verb}ed successfully!`);
                    navigate('/Teams');
                } else {
                    errorToast('Unknown error, team might already be registered')
                }
            })
        } else if (team && user) {
            successToast(`Team ${verb}ed successfully!`);
            navigate('/Teams');
        } else {
            errorToast(`Unknown error ${verb}ing team.`);
        }
    };

    return (
        <>
            <form className="w-full" onSubmit={handleSubmit}>
                {
                    verb === EDIT && initialTeam && !tournament?.teams.map((t: Team) => t.id).includes(initialTeam.id) ?
                    <p className="text-gray-600 pb-2 text-xs">
                        Team name and players cannot be edited once they have competed. To change, please use the clear button at the bottom of the form.
                    </p> : null
                }
                <p className={`font-pop ${styles.label} ${active === 'name' ? styles.pulse : ''}`}>Team Name</p>
                <TextBox
                    id="team_name"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="Enter a team name..."
                    disabled={verb == 'edit'}
                    onFocus={() => setActive('name')}
                    onBlur={() => setActive('')}
                />
                {
                    teamPlayers.map((player, index) => (
                        <React.Fragment key={`player-picker-${index}`}>
                            <p className={`font-pop ${styles.label} ${active === `p${index}` ? styles.pulse : ''}`}>{`Player ${index + 1}`}</p>
                            <PeoplePicker
                                people={players.filter(p => !teamPlayers.some(tp => tp?.id === p.id))}
                                onChange={u => setTeamPlayers(prev => {
                                    const copy = [...prev];
                                    copy[index] = u;
                                    return copy;
                                })}
                                selected={player}
                                disabled={player?.id === user?.player.id || verb == 'edit'}
                                onFocus={() => setActive(`p${index}`)}
                                onBlur={() => setActive('')}
                            />
                        </React.Fragment>
                    ))
                }

                <p className={`font-pop ${styles.label} ${active === 'song' ? styles.pulse : ''}`}>Walkout Song</p>
                <SongPicker
                    onChange={setWalkoutSong}
                    selected={walkoutSong}
                    onFocus={() => setActive('song')}
                    onBlur={() => setActive('')}
                />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className={`font-pop ${styles.label} ${active === 'ts' ? styles.pulse : ''}`}>Timestamp</p>
                        <TimestampPicker
                            song={walkoutSong}
                            timestamp={timestamp}
                            onChange={setTimestamp}
                            onFocus={() => setActive('ts')}
                            onBlur={() => setActive('')}
                        />
                    </div>
                    <div>
                        <p className={`font-pop ${styles.label} ${active === 'dur' ? styles.pulse : ''}`}>Duration</p>
                        <DurationPicker
                            song={walkoutSong}
                            timestamp={timestamp}
                            duration={duration}
                            onChange={setDuration}
                            onFocus={() => setActive('dur')}
                            onBlur={() => setActive('')}
                        />
                    </div>
                </div>
                <br />
                <Button
                    type="submit"
                    variant="green"
                    disabled={!name || teamPlayers.some(p => !p) || !walkoutSong || !timestamp || !duration || (verb === CREATE &&  tournament && new Date() > new Date(tournament?.enrollTime))}
                >
                    {verb === CREATE ? 'Register Team' : 'Save Team'}
                </Button>
            </form>
            {
                verb === EDIT && initialTeam && !tournament?.teams.map((t: Team) => t.id).includes(initialTeam.id) ? (
                    <Button
                        type="button"
                        variant="blue"
                        onClick={() => setVerb(CREATE)}
                    >
                        Clear Team
                    </Button>
                ) : null
            }
        </>
    );
};

TeamForm.defaultProps = {
    initialTeam: undefined,
};

export default TeamForm;
