import TeamCard from './TeamCard';
import { Team, Tournament } from '../../types';
import { useUser } from '../../contexts/User';

const Teams: React.FC<{ tournament: Tournament | undefined, showAll?: boolean }> = ({ tournament, showAll }: { tournament: Tournament | undefined, showAll?: boolean }) => {
  const { user } = useUser();

  let filteredTeams = tournament?.teams?.filter((team: Team) => showAll || !user?.team || team.id !== user.team.id);

  return (
    <div>
      <h1 className="text-md">All Teams {filteredTeams ? `(${filteredTeams.length})` : ''}</h1>
      <div className="flex flex-row flex-wrap w-full max-w-max">
        {
          filteredTeams?.map((team: Team) => <TeamCard key={team.name} {...team} />)
        }
      </div>
    </div>
  );
};

export default Teams;
