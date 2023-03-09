import Header from "../../components/Header";
import TeamForm from "../../components/TeamForm";
import { useTournament } from "../../contexts/Tournament";

const EditTeam = () => {
    const { tournament, user, loading } = useTournament();

    if (!tournament || new Date() > new Date(tournament.startTime) && false) {
        return <>
            <div
                style={{
                    paddingTop: '6rem',
                    textAlign: 'center'
                }
            }>
                <Header fs={'2rem'} mx={1} wrap={true}>team registration is currently locked.</Header>
                <p className="text-gray-600 pb-2 pt-2 text-xs">
                    Come back closer to the next event.
                </p>
            </div>
        </>
    }

    return <>
        <Header fs={'2.5rem'} mx={0}>your team</Header>
        <p className="text-gray-600 pb-2 text-xs">
            This will be your team for {tournament.name}
        </p>
        { !loading && <TeamForm initialTeam={user?.team} /> }
    </>
};

export default EditTeam;