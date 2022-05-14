import { useSubscription } from '@apollo/client';
import UsersRow, { User } from './UsersRow';
import { USERS_SUBSCRIPTION } from '../../services/subscriptions';

const Users = () => {
  const { data, loading } = useSubscription(USERS_SUBSCRIPTION);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p className="text-gray-600 pt-2">Registered Users</p>
      <table className="table-auto w-full text-left border">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="w-1/12 py-3 pl-2 pr-1">UID</th>
            <th className="w-1/12 py-3 px-1">PID</th>
            <th className="py-3 px-6">FULL NAME</th>
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
