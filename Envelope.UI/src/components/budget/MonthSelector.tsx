import { Radio } from "antd";
import { getMonthString, formatMonthString } from "../../util/monthlyBudgetHelper";

interface Props {
  month: string;
  onChange(newMonth: string): void;
}

export default function MonthSelector(props: Props) {
  const { month, onChange } = props;

  return (
    <Radio.Group size="large" value={month} onChange={(e) => onChange(e.target.value)}>
      <Radio.Button value={getMonthString(month, -1)}>{"<"}</Radio.Button>
      <Radio.Button disabled>{formatMonthString(month)}</Radio.Button>
      <Radio.Button value={getMonthString(month, 1)}>{">"}</Radio.Button>
    </Radio.Group>
  );
}
