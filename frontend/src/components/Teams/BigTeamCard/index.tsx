import { useNavigate } from 'react-router-dom';
import { Team, Player } from '../../../types';

const BigTeamCard: React.FC<Team> = ({ id, name, players, song }: Team) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/Team/Edit`);
  };
  return (
    <div
        style={{
            boxShadow: '5px 5px #3b5a6e'
        }}
        className="btn bg-slate-50 border-2 border-blue p-4 mb-4 min-w-full cursor-pointer"
        onClick={onClick}
    >
      <h1 className="text-md font-bold">{name}</h1>
      <div className="grid grid-cols-2 mt-2">
        <div className="justify-items-center">
          <div className="">
            <h2 className="text-sm font-semibold">Members</h2>
            {
                players?.map((p: Player) => (<p key={`${p.firstName} ${p.lastName}`} className='whitespace-nowrap text-xs'>{`${p.firstName} ${p.lastName}`} <span className="text-gray-600">({p.stats.record.wins} - {p.stats.record.losses})</span></p>))
            }
          </div>
        </div>
        <div className="justify-self-end">
          <img
            className="rounded-md h-auto w-auto"
            src={song?.image}
            alt={song?.name}
            style={{
              maxWidth: '85px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BigTeamCard;