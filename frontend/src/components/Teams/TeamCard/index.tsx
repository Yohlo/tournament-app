import { useNavigate } from 'react-router-dom';
import { Team } from '../../../types';
import { useUser } from '../../../contexts/User';

const TeamCard: React.FC<Team> = ({ id, name, players, song }: Team) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const onClick = () => {
    if (user?.admin) {
        navigate(`/Teams/Edit/${id}`);
    }
  };

  return (
    <div className="btn border-2 border-black bg-slate-50 p-4 mt-0 mb-4 min-w-full" onClick={onClick}>
      <h1 className="text-md font-bold">{name}</h1>
      <div className="grid grid-cols-2 mt-2">
        <div className="justify-items-center">
          <div className="">
            {
                players?.map(p => (<p key={`${p.firstName} ${p.lastName}`} className='whitespace-nowrap text-xs'>{`${p.firstName} ${p.lastName}`} <span className="text-gray-600">({p.stats.record.wins} - {p.stats.record.losses})</span></p>))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
