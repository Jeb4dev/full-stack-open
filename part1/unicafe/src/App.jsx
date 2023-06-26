import { useState } from "react";

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistic = ({ good, neutral, bad }) => (
  <>
    <h1>statistics</h1>
    {good + neutral + bad === 0 ? (
      <p>No feedback given</p>
    ) : (
      <>
        <table>
          <tbody>
            <StatisticLine text={"good"} value={good} />
            <StatisticLine text={"neutral"} value={neutral} />
            <StatisticLine text={"bad"} value={bad} />
            <StatisticLine text={"all"} value={good + neutral + bad} />
            <StatisticLine
              text={"average"}
              value={(good - bad) / (good + neutral + bad)}
            />
            <StatisticLine
              text={"positive"}
              value={(good / (good + neutral + bad)) * 100 + " %"}
            />
          </tbody>
        </table>
      </>
    )}
  </>
);

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

export default function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <h1>give feedback</h1>
      <Button text={"good"} onClick={() => setGood(good + 1)} />
      <Button text={"neutral"} onClick={() => setNeutral(neutral + 1)} />
      <Button text={"bad"} onClick={() => setBad(bad + 1)} />
      <Statistic good={good} neutral={neutral} bad={bad} />
    </>
  );
}
