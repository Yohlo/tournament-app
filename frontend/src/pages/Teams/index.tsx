import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import TeamComponent from '../../components/Teams';
import Header from '../../components/Header';
import Button from '../../components/Button';
import BigTeamCard from '../../components/Teams/BigTeamCard';
import { useTournament } from '../../contexts/Tournament';

const Teams = () => {
  const navigate = useNavigate();
  const { user, tournament } = useTournament();

  return (
    <>
      <Header fs={'2.5rem'} mx={0}>Teams</Header>
      <p className="text-gray-600 pb-2 text-xs">
        Teams that have signed up for {tournament?.name || 'the upcoming tournament.'}
      </p>
      <section>
        <h1 className="text-lg font-bold mt-2">My Team</h1>
        <div className="flex flex-grow-1 w-full">
          {
            user?.team && tournament?.teams?.find(t => t.id === user.team?.id)
              ? <BigTeamCard key={user.team.name} {...user.team} />
              : null
          }
        </div>
        {
          !(user?.team && tournament?.teams?.find(t => t.id === user.team?.id))
            ? (
              <Button type="button" variant="green" onClick={() => navigate('/Team/Edit')}>
                <FontAwesomeIcon icon={faPlus} />
                <span className="ml-2">Create Team</span>
              </Button>
            ) : null
        }
        <TeamComponent tournament={tournament} />
      </section>
    </>
  );
};

export default Teams;
