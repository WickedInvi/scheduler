interface ToggleDaysProps {
  showOtherDays: boolean;
  onToggle: () => void;
}

const ToggleDays = ({ showOtherDays, onToggle }: ToggleDaysProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input type="checkbox" className="toggle" onChange={onToggle} />
        {showOtherDays ? (
          <span className="label-text px-5">Hide Other Days</span>
        ) : (
          <span className="label-text px-5">Show Other Days</span>
        )}
      </label>
    </div>
  );
};

export default ToggleDays;
