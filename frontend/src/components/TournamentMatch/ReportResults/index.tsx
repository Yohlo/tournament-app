/* eslint-disable eqeqeq */
import Button from '../../Button';
import TextBox from '../../TextBox';

interface Props {
  onSubmit: () => void,
  teamOneScore: number,
  onTeamOneScoreChange: (score: number) => void,
  teamTwoScore: number,
  onTeamTwoScoreChange: (score: number) => void,
}

// eslint-disable-next-line max-len
const ReportResults = ({ onSubmit, teamOneScore, onTeamOneScoreChange, teamTwoScore, onTeamTwoScoreChange }: Props) => {
  const canSubmit = (): boolean => (teamOneScore == 10 && teamTwoScore != 10)
    || (teamTwoScore == 10 && teamOneScore != 10);

  const submitString = () => (canSubmit() ? 'Submit' : 'The winning team must have a score of 10.');

  return (
    <>
      <div className="flex gap-4">
        <div className="flex-grow">
          <p className="font-pop leading-10">team 1 score</p>
          <TextBox
            id="team1-score"
            type="number"
            value={teamOneScore}
            onChange={onTeamOneScoreChange}
          />
        </div>
        <div className="flex-grow">
          <p className="font-pop leading-10">team 2 score</p>
          <TextBox
            id="team2-score"
            type="number"
            value={teamTwoScore}
            onChange={onTeamTwoScoreChange}
          />
        </div>

      </div>
      <Button
        type="button"
        variant="green"
        disabled={!canSubmit()}
        onClick={onSubmit}
      >
        {submitString()}
      </Button>
    </>
  );
};

export default ReportResults;
