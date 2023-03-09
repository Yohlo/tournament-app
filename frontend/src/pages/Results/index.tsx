import { useState } from 'react';
import { useSubscription } from '@apollo/client';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { faFrown as sad } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../../components/Header';
import { useInterval } from '../../hooks';
import { TOURNAMENT_MATCHES_SUBSCRIPTION } from '../../services/subscriptions';
import { Match } from '../../types';
import { timeSince } from '../../utils';
import { useTournament } from '../../contexts/Tournament';
import Loader from '../../components/Loader';

const MatchCard = (props: Match) => {
  const { id, team1, team2, teamOneCups, teamTwoCups, endTime } = props;
  const [ended, setEnded] = useState<string>(endTime ? timeSince(`${endTime}`) : '');
  useInterval(() => setEnded(endTime ? timeSince(`${endTime}`) : ''), ended.includes('second') ? 1000 : 60000);

  return (
    <div
      id={`match-${id}`}
      style={{
        boxShadow: '5px 5px 0 0 black',
      }}
      className="max-w-md md:w-auto p-6 pb-4 border-2 cursor-pointer border-black bg-slate-50"
    >
      <div className={`flex flex-row gap-4 mb-2`}>
        <div className="relative w-full">
          {
            teamOneCups === 10
              ? (
                <span className="absolute transform -rotate-45 -left-4 -top-4 text-yellower">
                  <FontAwesomeIcon icon={faCrown} />
                </span>
              ) : null
          }
          <h1 className={`text-left text-md font-extrabold leading-none h-1/4 w-full ${teamOneCups === 10 ? 'text-green' : 'text-red'}`}>
            {team1?.name}
          </h1>
        </div>
        <div>
          <h1 className="text-md text-gray-800 leading-none h-1/4">
            vs
          </h1>
        </div>
        <div className="relative w-full">
          {
            teamTwoCups === 10
              ? (
                <span className="absolute transform rotate-45 -right-4 -top-4 text-yellower">
                  <FontAwesomeIcon icon={faCrown} />
                </span>
              ) : null
          }
          <h1 className={`text-right text-md font-extrabold leading-none h-1/4 ${teamTwoCups === 10 ? 'text-green' : 'text-red'}`}>
            {team2?.name}
          </h1>
        </div>
      </div>
      {
        <div className="flex flex-row gap-4">
          <div className="flex-grow text-gray-800">
            {
              team1.players.map(player => (
                <p key={`p-${player.id}`} className="text-left text-xs text-gray-600">
                  {player.firstName + ' ' + player.lastName} ({player.stats.record.wins} - {player.stats.record.losses})
                </p>
              ))
            }
            <p className="text-left text-sm">
              {teamOneCups}
              {' cups'}
            </p>
            <p className="text-xs text-left text-gray-400">{`${ended} ago`}</p>
          </div>
          <div className="flex-grow text-gray-800">
          {
              team2.players.map(player => (
                <p key={`p-${player.id}`} className="text-right text-xs text-gray-600">
                  {player.firstName + ' ' + player.lastName} ({player.stats.record.wins} - {player.stats.record.losses})
                </p>
              ))
            }
            <p className="text-right text-sm">
              {teamTwoCups}
              {' cups'}
            </p>
          </div>
        </div>
      }
    </div>
  );
};

const FinishedMatches = () => {
  const { tournament, loading } = useTournament();
  const { data } = useSubscription(TOURNAMENT_MATCHES_SUBSCRIPTION, {
      skip: !tournament,
      variables: {
          tournamentId: tournament?.id
      }
  });
  const matches: Match[] = data?.tournamentMatches;

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div id="finished-matches" className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full">
        {
          matches?.length
            ? matches.filter((match: Match) => !!match.endTime)
              ?.sort((m1, m2) => (m1.endTime && m2.endTime && (new Date(m1.endTime) <= new Date(m2.endTime)) ? 1 : -1))
              ?.map((match: Match) => (
                <MatchCard key={`match-${match.id}`} {...match} />
              ))
            : (
              <div className="w-full text-center pt-6">
                <FontAwesomeIcon className="text-gray-500 text-5xl mb-2" icon={sad} />
                <p className="text-sm text-gray-700">There are no matches yet.</p>
              </div>
            )
        }
      </div>
    </div>
  );
};

const Results = () => (
  <div className="mt-6">
    <Header fs={'2rem'} mx={0}>results</Header>
    <FinishedMatches />
  </div>
);

export default Results;