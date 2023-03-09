import { useQuery } from '@apollo/client';
import UsersRow, { User } from './UsersRow';
import { ALL_USERS } from '../../services/queries';
import Loader from '../Loader';

const Users = () => {
  const { data, loading } = useQuery(ALL_USERS);
  
  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-gray-600 pt-2">Registered Users ({`${data?.users.length}`})</p>
      <table className="table-auto w-full text-left border">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6">NAME</th>
            <th className="w-1/12 py-3 px-6">NUMBER</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {
            data?.users?.map((user: User, index: number) => (
              <UsersRow
                key={user.id}
                data={user}
                index={index}
              />
            ))
          }
        </tbody>
      </table>
    </>
  );
};

export default Users;
