import { useState, useEffect, useRef } from 'react';
import * as spotify from 'spotify-web-sdk';
import { Device } from 'spotify-web-sdk';
import { useSubscription } from '@apollo/client';
import Speech from 'speak-tts';
import Header from '../../components/Header';
import TournamentMatch from '../../components/TournamentMatch';
import { Song, Team } from '../../types';
import { TABLES_SUBSCRIPTION } from '../../services/subscriptions';
import TextBox from '../../components/TextBox';
import Loader from '../../components/Loader';

interface DeviceListboxProps {
  selected: Device | undefined,
  onChange: (d: Device | undefined) => void,
  devices: Device[],
}

interface ItemProps {
  device: Device,
  onClick: (id: string) => void
}

const Item: React.FC<ItemProps> = ({ device, onClick }: ItemProps) => (
  <div
    className={'w-full text-left p-4 max-w-10 border-b border-gray-100 hover:bg-gray-100 '
      + 'cursor-pointer'}
    onClick={() => onClick(device.id)}
  >
    { device.name }
  </div>
);

const DeviceListbox = ({ selected, onChange, devices }: DeviceListboxProps) => {
  const [name, setName] = useState<string>(selected?.name || '');
  const [suggested, setSuggested] = useState<Device[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setName(selected?.name || '');
  }, [selected]);

  useEffect(() => {
    const matches: any[] = [];
    devices.map((d: Device) => {
      if (d.name.toLowerCase().includes(name?.toLowerCase())) {
        matches.push(d);
      }
      return d;
    });
    setSuggested(matches);
  }, [name, devices]);

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

  const handleClick = (id: string): void => {
    const clicked = devices.find((d: Device) => d.id === id);
    onChange(clicked);
    setShow(false);
  };

  const handleChange = (value: string) => {
    if (!show) { setShow(true); }
    setName(value);
  };

  return (
    <div className="flex flex-col">
      <p className="font-pop leading-10">spotify device</p>
      <TextBox
        id="spotify-device-picker"
        innerRef={inputRef}
        type="text"
        value={name}
        onChange={handleChange}
        autoComplete="on"
        placeholder="Select a Spotify playback device"
      />
      <div className="relative">
        {
          show && devices.length
            ? (
              <div className="block absolute shadow-outer -top-7 left-0 z-40 border rounded-b-md bg-white border-gray-300 w-full">
                {
                  suggested
                    .map((d) => <Item key={d.id} device={d} onClick={handleClick} />)
                }
              </div>
            )
            : null
        }
      </div>
    </div>
  );
};

const Tournament = () => {
  const { data, loading } = useSubscription(TABLES_SUBSCRIPTION);
  const [tables, setTables] = useState<any>(data?.tables);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const accessToken = sessionStorage.getItem('access_token');

  // Get available devices after authenticating
  useEffect(() => {
    spotify.init({
      token: accessToken || '',
    });

    spotify.getUserAvailableDevices()
      .then((value) => setDevices(value))
      .then(() => setSelectedDevice(devices[0]));
  }, [accessToken]);

  useEffect(() => {
    setTables(data?.tables);
  }, [data]);

  const speech = new Speech();
  speech.init({
    volume: 1,
    lang: 'en-US',
    rate: 1,
    pitch: 1,
    splitSentences: true,
  }).then((voices: SpeechSynthesisVoice[]) => {
    try {
      speech.setVoice('Daniel');
    } catch {
      console.log(voices);
      console.log('Couldn\'t get default voice (Google UK English Male)');
    }
  });

  const timestampToMs = (timestamp: string, duration = false): number => {
    try {
      const timestampParts = timestamp.split(':');
      const mm = parseInt(timestampParts[0], 10);
      const ss = parseInt(timestampParts[1], 10);
      const ms = (mm * 60 + ss) * 1000;
      if (duration) {
        return ms > 15000 ? 15000 : ms;
      }
      return ms;
    } catch {
      return 0;
    }
  };

  const announce = async (text: string): Promise<any> => speech.speak({
    text,
    queue: true,
    listeners: {
      onend: () => {},
    },
  });

  const airhorns = async (): Promise<any> => {
    const audio: HTMLAudioElement | null = document.querySelector('#airhorns');
    return audio?.play()
      .then(() => new Promise((resolve) => setTimeout(resolve, 3000)));
  };

  const play = async (song: Song | undefined): Promise<any> => {
    if (!song) return Promise.reject(new Error('No song provided'));

    const pause = () => spotify.pauseUserPlayback({
      deviceId: selectedDevice?.id,
    });

    return spotify.startUserPlayback({
      deviceId: selectedDevice?.id,
      uris: [`spotify:track:${song.id}`],
      positionMs: timestampToMs(song.start),
    })
      .then(() => new Promise((resolve) => setTimeout(resolve, timestampToMs(song?.duration, true))))
      .then(() => pause())
      .then(() => new Promise((resolve) => setTimeout(resolve, 1000)));
  };

  const runAnnouncer = async (table: string, teamOne: Team | null, teamTwo: Team | null) => {
    const teamOneIntro: string = `${teamOne?.name}`;
    const teamTwoIntro: string = `${teamTwo?.name}`;
    const getReady: string = `Good luck, have fun!`;

    return airhorns()
      .then(() => play(teamOne?.song))
      .then(() => announce(teamOneIntro))
      .then(() => announce('Versus'))
      .then(() => play(teamTwo?.song))
      .then(() => announce(teamTwoIntro))
      .then(() => announce(getReady));
  };

  const start = async (table: string, teamOne: Team | null, teamTwo: Team | null, game: any) => {
    setTables((prev: any) => prev.map((t: any) => {
      if (t.name === table) {
        return {
          ...t,
          game,
        };
      }
      return t;
    }));

    return runAnnouncer(table, teamOne, teamTwo);
  };

  const clearTable = (name: string) => setTables((prev: any) => prev.map((t: any) => {
    if (t.name === name) {
      return {
        ...t,
        game: null,
      };
    }
    return t;
  }));

  return (
    <>
      <Header fs={'2.5rem'} mx={0}>Tournament</Header>
      <audio id="airhorns" src="https://cdn.discordapp.com/attachments/762855779002351661/847637076131708958/airhorn.mp3" />
      <DeviceListbox
        selected={selectedDevice}
        devices={devices}
        onChange={setSelectedDevice}
      />
      <section>
        {
          loading && (
            <div
              style={{
                paddingTop: '30vh'
              }}
            >
              <Loader />
              <p className="font-pop leading-10 text-center">loading tables... this does take a minute for some reason</p>
            </div>
          )
        }
        {
          tables?.map((table: any) => (
            <TournamentMatch
              key={table.name}
              table={table.name}
              tableId={table.id}
              match={table.activeMatch}
              start={start}
              clear={clearTable}
              announceResult={announce}
              runAnnouncer={runAnnouncer}
            />
          ))
        }
      </section>
    </>
  );
};
export default Tournament;
