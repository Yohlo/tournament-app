import { useMutation, useQuery } from '@apollo/client';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useTournament } from '../../contexts/Tournament';
import { useToasts } from '../../hooks';
import { CREATE_MATCH, END_MATCH } from '../../services/mutations';
import { Team } from '../../types';
import Button from '../Button';
import Header from '../Header';
import ReportResults from './ReportResults';
import TextBox from '../TextBox';

interface TeamListBoxProps {
  selected: Team | null,
  opponent: Team | null,
  onChange: (t: Team) => void,
  label: string,
  table: string,
}

interface ItemProps {
  id: number,
  name: string,
  onClick: (id: number) => void
}

const Item: React.FC<ItemProps> = ({ id, name, onClick }: ItemProps) => (
  <div
    className={'w-full text-left p-4 max-w-10 border-b border-gray-100 hover:bg-gray-100 '
      + 'cursor-pointer'}
    onClick={() => onClick(id)}
  >
    { name }
  </div>
);

const TeamListBox = ({ selected, opponent, onChange, label, table }: TeamListBoxProps) => {
  const { tournament } = useTournament();
  const [name, setName] = useState<string>(selected?.name || '');
  const [suggested, setSuggested] = useState<Team[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setName(selected?.name || '');
  }, [selected]);

  useEffect(() => {
    const matches: any[] = [];
    tournament?.teams?.map((t: any) => {
      if (t?.name.toLowerCase().includes(name?.toLowerCase())) {
        matches.push(t);
      }
      return t;
    });
    setSuggested(matches);
  }, [name, tournament]);

  useEffect(() => {
    const handleMouseDown = (event: Event) => {
      if (event.target !== inputRef.current) {
        setShow(false);
      }
      if (event.target === inputRef.current) {
        setShow(true);
      }
    };

    document.addEventListener('click', handleMouseDown);

    return () => document.removeEventListener('click', handleMouseDown);
  }, []);

  useEffect(() => {
    if (!show && selected) {
      setName(selected.name);
    }
  }, [show, selected]);

  const handleClick = (id: number): void => {
    const team = tournament?.teams.find((u: any) => u.id === id);
    if (team) {
        onChange(team);
        setShow(false);
    }
  };

  const handleChange = (value: string) => {
    if (!show) { setShow(true); }
    setName(value);
  };

  return (
    <div className="flex flex-col">
      <TextBox
        id={`${label}-team-${table}`}
        innerRef={inputRef}
        type="text"
        value={name}
        onChange={handleChange}
        autoComplete="off"
        placeholder={`Select the ${label} team...`}
      />
      <div className="relative">
        {
          show && tournament?.teams.length
            ? (
              <div className="block absolute shadow-outer -top-7 left-0 z-40 border rounded-b-md bg-white border-gray-300 w-full">
                {
                  suggested.filter((t) => (opponent ? t.id !== opponent.id : true))
                    .map((t) => <Item key={t.id} id={t.id} name={t.name} onClick={handleClick} />)
                }
              </div>
            )
            : null
        }
      </div>
    </div>
  );
};

interface Props {
  start: (table: string, teamOne: Team | null, teamTwo: Team | null, match: any) => void,
  clear: (name: string) => void,
  announceResult: (result: string) => void,
  table: string,
  tableId: number,
  match: any | null,
  runAnnouncer: (table: string, teamOne: Team | null, teamTwo: Team | null) => void,
}

const TournamentMatch = ({ table, tableId, start, announceResult, match, clear, runAnnouncer }
: Props) => {
  const [teamOne, setTeamOne] = useState<Team | null>(match?.team1);
  const [teamOneScore, setTeamOneScore] = useState<number>(match?.teamOneCups || 10);
  const [teamTwo, setTeamTwo] = useState<Team | null>(match?.team2);
  const [teamTwoScore, setTeamTwoScore] = useState<number>(match?.teamTwoCups || 10);
  const [reporting, setReporting] = useState<boolean>(false);
  const [createMatch] = useMutation(CREATE_MATCH);
  const [endMatch] = useMutation(END_MATCH);
  const { successToast, errorToast } = useToasts();
  const { tournament } = useTournament();

  useEffect(() => {
    if (match === null) {
      setTeamOne(null);
      setTeamTwo(null);
      setTeamOneScore(0);
      setTeamTwoScore(0);
    }
  }, [match]);

  const startMatch = async () => {
    createMatch({
      variables: {
        match: {
          tournamentId: tournament?.id,
          teamOneId: teamOne?.id,
          teamTwoId: teamTwo?.id,
          tableId
        },
      },
    }).then(response => {
      if (response.errors) {
        errorToast(response.errors[0].toString());
      } else {
        successToast('Game Started!');
        start(table, teamOne, teamTwo, response.data.createMatch);
      }
    }).catch(() => {
      errorToast('Unknown error creating match.');
    });
  };

  const toggleReporting = () => {
    setReporting(!reporting);
  };

  const report = async () => {
    const matchResponse = await endMatch({
      variables: {
        matchId: match.id,
        match: {
          otCount: 0,
          teamOneCups: +teamOneScore,
          teamTwoCups: +teamTwoScore,
        },
      },
    });

    if (!matchResponse.data) {
      errorToast('Unknown error editing match');
    }

    if (matchResponse.errors) {
      errorToast(matchResponse.errors[0].toString());
      return;
    }

    successToast('Match finished!');

    clear(table);

    // eslint-disable-next-line eqeqeq
    const winnerAnnouncement = teamOneScore == 10
      ? `${teamOne?.name} has defeated ${teamTwo?.name} with a score of ${teamOneScore} cups to ${teamTwoScore} cups`
      : `${teamTwo?.name} has defeated ${teamOne?.name} with a score of ${teamTwoScore} cups to ${teamOneScore} cups`;
    announceResult(winnerAnnouncement);
    setReporting(false);
    setTeamOneScore(0);
    setTeamTwoScore(0);
  };

  return (
    <div className="my-4 relative">
      <button
        type="button"
        className="absolute bottom-4 left-4 text-gray-400"
        onClick={() => runAnnouncer(table, teamOne, teamTwo)}
      >
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
      <div className="flex flex-row justify-start">
      <Header fs={'2rem'} mx={0} className="m-0">
        {table}
      </Header>
      <div className="self-center pl-8">
        {
          match?.startTime && !match?.endTime
          ? (
            <div className="flex flex-row nowrap align-self-center justify-self-center mx-auto max-w-max min-w-min">
                <div className="in-progress-blob red mr-2" />
                <p className="text-pop text-gray-500 text-xs">In Progress</p>
              </div>
            )
            : null
          }
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex-grow">
          <TeamListBox
            selected={teamOne}
            opponent={teamTwo}
            onChange={setTeamOne}
            label="Home"
            table={table}
          />
        </div>
        <div className="flex-none">
          <span className="text-xl">
            vs
          </span>
        </div>
        <div className="flex-grow">
          <TeamListBox
            selected={teamTwo}
            opponent={teamOne}
            onChange={setTeamTwo}
            label="Away"
            table={table}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-1/3"></div>
        <div className="w-1/3">
          {
            match?.startTime && !match?.endTime
              ? (
                <Button
                  type="button"
                  variant="blue"
                  disabled={!teamOne || !teamTwo}
                  onClick={toggleReporting}
                >
                  {reporting ? 'Hide' : 'Report Result'}
                </Button>
              )
              : (
                <Button
                  type="button"
                  variant="green"
                  disabled={!teamOne || !teamTwo}
                  onClick={startMatch}
                >
                  Start Match
                </Button>
              )
          }
        </div>
      </div>
      <div>
        {
          reporting
            ? (
              <ReportResults
                onSubmit={report}
                teamOneScore={teamOneScore}
                onTeamOneScoreChange={setTeamOneScore}
                teamTwoScore={teamTwoScore}
                onTeamTwoScoreChange={setTeamTwoScore}
              />
            )
            : (null)
        }
      </div>
    </div>
  );
};

export default TournamentMatch;
