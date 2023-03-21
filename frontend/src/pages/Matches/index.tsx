import { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { TABLES_SUBSCRIPTION } from '../../services/subscriptions';
import { Table, Team } from '../../types';
import { timeSince } from '../../utils';
import Results from '../Results';
import { useInterval } from '../../hooks';

const TeamBlock: React.FC<Team> = ({ name, players }: Team) => (
  <div className="mx-auto">
    <h1 className="text-sm lg:text-md font-bold text-black leading-none h-1/4">{name}</h1>
    {
        players.map(p => <p className="text-xs text-gray-700 h-1/4">{p.firstName + ' ' + p.lastName} <span>({p.stats.record.wins + '-' + p.stats.record.losses})</span></p>)
    }
  </div>
);

const TableCard: React.FC<Table> = ({ name, activeMatch }: Table) => {
  const [started, setStarted] = useState<string>(timeSince(`${activeMatch?.startTime}`));
  useInterval(() => setStarted(activeMatch ? timeSince(`${activeMatch.startTime}`) : ''), started.includes('second') ? 1000 : 60000);

  return (
    <div
      style={{
        boxShadow: `5px 5px 0 0 ${activeMatch ? '#0d70d5' : '#616161'}`,
        borderColor: `${activeMatch ? '#0d70d5' : '#616161'}`
      }}
      className="border-2 h-28 lg:h-40 w-full md:mr-4 p-2 my-2 lg:p-4"
    >
      <h1 className="text-md lg:text-2xl font-bold text-center h-1/4">{name}</h1>
      {
        activeMatch
          ? (
            <>
              <div className="flex flex-row flex-nowrap p-1 items-center h-3/4">
                <div className="w-1/2 text-left pr-2 border-gray-400 border-dashed border-r-2 flex items-center">
                  <TeamBlock {...activeMatch?.team1} />
                </div>
                <div className="w-1/2 text-left pl-2 flex items-center">
                  <TeamBlock {...activeMatch?.team2} />
                </div>
              </div>
              <div className="flex flex-row -mt-24 lg:-mt-2">
                <div className="in-progress-blob blue mr-2" />
                <p className="text-xs text-gray-600">{`Started ${started || 'a few seconds'} ago`}</p>
              </div>
            </>
          )
          : (
            <div className="h-full text-center mt-2">
              <h1 className="text-md font-bold text-gray-500 leading-none">
                There is currently no active match at this table.
              </h1>
              <p className="text-xs mt-2 text-gray-500 leading-none">
                Yell at Salah.
              </p>
            </div>
          )
      }
    </div>
  );
};

const ActiveGames = () => {
  const { data, loading } = useSubscription(TABLES_SUBSCRIPTION);

  const tables: Table[] = data?.tables;

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div id="active-games" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {
          tables
            ?.map((table: Table) => <TableCard key={table.id} {...table} />)
        }
      </div>
    </div>
  );
};

const Matches = () => (
  <>
    <Header fs="2rem" mx={0}>Ongoing Matches</Header>
    <ActiveGames />
    <Results />
  </>
);

export default Matches;