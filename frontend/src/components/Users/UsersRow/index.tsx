import { useState } from 'react';

export interface User {
  id: number,
  number: string,
  admin: boolean,
  player: Player,
  lastActivity: string,
  registrationDate: string,
}

interface Player {
  id: number,
  firstName: string,
  lastName: string,
}

interface Props {
  data: User,
  index: number,
}

const UsersRow = ({ data, index }: Props) => {
  const [name] = useState(data ? `${data.player?.firstName} ${data.player?.lastName}` : '');

  return (
    <tr key={data.id} className={`${index % 2 === 1 ? 'bg-gray-50' : ''} border-b border-gray-200 hover:bg-gray-100`}>
      <td className="py-3 px-6 text-left">
        <input className="bg-transparent rounded w-full" disabled value={name} />
      </td>
      <td className="py-3 px-6 text-left">{data.number}</td>
    </tr>
  );
};

export default UsersRow;
