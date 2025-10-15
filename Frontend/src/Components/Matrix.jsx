import { useState } from "react";
import style from "./Matrix.module.css";

export default (props) => {
  const [matrix, setMatrix] = useState([
    [1, 1.43, 2.0, 6.67, 1.25],
    [0.7, 1, 1.25, 2.0, 0.83],
    [0.5, 0.8, 1, 1.0, 0.5],
    [0.15, 0.5, 1.0, 1, 0.2],
    [0.8, 1.2, 2.0, 5.0, 1],
  ]);

  return (
    <table className={style["matrix"]}>
      <thead>
        <tr>
          <th>A1</th>
          <th>A2</th>
          <th>A3</th>
          <th>A4</th>
          <th>A5</th>
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            <td className={style["signatures"]}></td>
            {row.map((obj, i) => (
              <td key={i}>{obj}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
