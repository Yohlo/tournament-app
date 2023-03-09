import { useEffect, useContext, useState, FormEventHandler } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useToasts } from '../../../hooks';
import Loader from '../../../components/Loader';
import { User, UserShort } from '../../../types';
import { UNASSOCIATED_PLAYERS } from '../../../services/queries';
import PeoplePicker from '../../../components/PeoplePicker';
import { UPDATE_USER_PLAYER, NEW_PLAYER_FOR_USER } from '../../../services/mutations';
import { useUser } from '../../../contexts/User';

const PickPlayerPage = ({ user }: { user: User }) => {
  const [player, setPlayer] = useState<UserShort | undefined>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const { successToast, errorToast } = useToasts();
  const { data }  = useQuery(UNASSOCIATED_PLAYERS);
  const [updateUserPlayer] = useMutation(UPDATE_USER_PLAYER);
  const [newPlayerForUser] = useMutation(NEW_PLAYER_FOR_USER);
  const [playerPool, setPlayerPool] = useState<UserShort[]>([]);

  useEffect(() => {
    if (data?.unassociatedPlayers?.length) {
        setPlayerPool([ ...data.unassociatedPlayers.map((p: any) => ({
            id: p.id,
            full_name: `${p.firstName} ${p.lastName}`
        })), ]);
    }
  }, [data]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!player) {
        setError('Please select an option from the dropdown.');
        return;
    }

    if (player.id === -1) {
      // new player
      var firstName = player.full_name.split(' ').slice(0, -1).join(' ');
      var lastName = player.full_name.split(' ').slice(-1).join(' ');

      const response = await newPlayerForUser({
          variables: {
              userId: user?.id,
              firstName,
              lastName
          },
      });
  
      setLoading(false);
      if (!response.data) {
          errorToast('Unknown error setting player.');
      } else if(response.data.newPlayerForUser && setUser) {
          successToast('User successfully created.');
          setUser(response.data.newPlayerForUser);
      }
    } else {
      // existing player
      const response = await updateUserPlayer({
          variables: {
              userId: user?.id,
              playerId: player.id
          },
        });
  
      setLoading(false);
      if (!response.data) {
          errorToast('Unknown error setting player.');
      } else if(response.data.updateUserPlayer && setUser) {
          successToast('User successfully created.');
          setUser(response.data.updateUserPlayer);
      }
    }
  }

  if (loading || !user) {
    return <Loader />;
  }

 return <form className="flex flex-col" onSubmit={handleSubmit}>
    <p className="font-pd text-white leading-10 mb-2">who are you?</p>
    <p className="font-pop mb-2 text-xs">Please select an option from the dropdown below.</p>
    <PeoplePicker people={playerPool} selected={player} onChange={setPlayer} error={error} allowNew={true} />
    <button type="submit" className="btn w-1/2 m-2 ml-0 font-pop self-end text-lg bg-yellow hover:bg-yellower text-black font-bold py-2 px-4 mb-6" >
        Confirm
    </button>
</form>
 
};

export default PickPlayerPage;
