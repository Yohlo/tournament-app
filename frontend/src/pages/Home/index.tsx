import Header from '../../components/Header';
import Countdown from 'react-countdown';
import { useTournament } from '../../contexts/Tournament';

function dhm(ms: number) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);
  return days + "d " + (hours < 10 ? '0' : '') + hours + "h " + (minutes < 10 ? '0' : '') + minutes + "m " + (sec < 10 ? '0' : '') + sec + 's';
}

const homeText = '<p class="text-gray-800 font-bold text-xl">Tournament starts at 7:00 PM</p><p class="text-gray-700 font-bold text-md">Doors open at 6:00 PM</p><p class="text-gray-700 font-bold text-md">4546 Eli St, Houston</p>';
const homeHeadingText = 'July 30, 2022';

const Home = () => {
  const { tournament } = useTournament();
  return <div className="mx-auto mt-8 max-w-lg max-h-full h-auto w-auto text-center">
    <div style={{
      marginTop: '-2rem'
    }}>
      <img alt="logo"
        style={{
          height: '15rem',
          margin: '0 auto'
        }}
        src={require('../../images/logo.png')}
      />
    </div>
    <Header fs='3rem'>{ homeHeadingText }</Header>
    <div dangerouslySetInnerHTML={{
      __html: homeText
    }} />
    <p className="pt-4 text-gray-700 font-bold text-xs">You can manage your team in the Teams tab.</p>

    {
      tournament?.enrollTime && (
      <Countdown
        date={new Date(tournament?.enrollTime)}
        intervalDelay={0}
        precision={3}
        renderer={(props: any) => {
          if (!props.total) {
            return <p className="mt-4 text-gray-700 text-sm">Team registration has been closed.</p>
          }
          return <div
            className="border-2 mt-4 p-4 border-black w-3/5 mx-auto my-0"
            style={{
              boxShadow: '5px 5px black'
            }}
          >
            <p className="text-gray-700 text-sm">Time left to enroll:</p>
            <p className='font-pop text-md'>{dhm(props.total)}</p>
          </div>
        }}
      />)
    }

    

  </div>;
};

export default Home;
