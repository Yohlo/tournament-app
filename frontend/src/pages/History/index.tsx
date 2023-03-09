import TeamComponent from '../../components/Teams';
import Header from '../../components/Header';
import React from 'react';
import { useTournament } from '../../contexts/Tournament';

const History = () => {
  const { tournaments, tournament } = useTournament();

  return (
    <>
      <Header fs={'2rem'} mx={0} wrap={true}>previous tournaments</Header>
      <p className="text-gray-600 pb-2 text-xs">
        Insights and statistics on wins, appearances and cups are coming soon. For now, this just shows which teams have previously competed. Winners appear at the top of the list.
      </p>
      <section>
        {
            tournaments?.filter(t => t.id !== tournament?.id).map(tournament => (
                <React.Fragment key={tournament.id + tournament.name}>
                    <p className="font-pop font-bold text-gray-900 pb-2 text-xl mt-4">
                        {tournament.name}
                    </p>
                    <TeamComponent showAll={true} tournament={tournament} />
                </React.Fragment>
            ))
        }
      </section>
    </>
  );
};

export default History;
