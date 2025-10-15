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

  function handleMatrixChange(e, y, x) {
    setMatrix((prev) => {
      const next = prev.map((row) => row.slice());
      next[y][x] = e.target.value;
      return next;
    });
  }

  function handleReciprocalMatrixChange(e, y, x) {
    setMatrix((prev) => {
      const next = prev.map((row) => row.slice());
      next[y][x] = e.target.value;
      next[x][y] = Math.round((1 / e.target.value) * 100000) / 100000;
      return next;
    });
  }

  function renderMatrix() {
    return matrix.map((row, i) => (
      <tr key={i}>
        <td className={style["signatures"]}></td>
        {row.map((obj, j) => (
          <td key={j}>
            <input
              type="number"
              value={matrix[i][j]}
              onChange={(e) => handleMatrixChange(e, i, j)}
            />
          </td>
        ))}
      </tr>
    ));
  }

  function renderReciprocalMatrix() {
    return matrix.map((row, i) => (
      <tr key={i}>
        <td className={style["signatures"]}></td>
        {row.map((obj, j) => (
          <td key={j}>
            {i == j ? (
              <input type="number" value={obj} readOnly={true} />
            ) : (
              <input
                type="number"
                value={matrix[i][j]}
                onChange={(e) => handleReciprocalMatrixChange(e, i, j)}
              />
            )}
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <table className={style["matrix"]}>
      <thead>
        <tr>
          <th></th>
          <th>A1</th>
          <th>A2</th>
          <th>A3</th>
          <th>A4</th>
          <th>A5</th>
        </tr>
      </thead>
      <tbody>
        {props.pairwiseComparison != true ? renderMatrix() : renderReciprocalMatrix()}
      </tbody>
    </table>
  );
};
