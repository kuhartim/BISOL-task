import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";

interface IntervalSelectorProps {
  onIntervalSelect: (startDate: string, endDate: string) => void;
  start: string;
  end: string;
  shownDays: number;
}

const IntervalSelector = ({
  onIntervalSelect,
  start,
  end,
  shownDays,
}: IntervalSelectorProps) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    const newEndDate = addDays(date, shownDays);
    onIntervalSelect(date.toISOString(), newEndDate.toISOString());
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    const newsStartDate = subDays(date, shownDays);
    onIntervalSelect(newsStartDate.toISOString(), date.toISOString());
  };

  return (
    <div className="container mt-5">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group d-flex flex-column flex-md-row align-items-center gap-2">
            <label>Začetni datum in čas</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group d-flex flex-column flex-md-row align-items-center gap-2">
            <label>Končni datum in čas</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              dateFormat="Pp"
              className="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntervalSelector;
