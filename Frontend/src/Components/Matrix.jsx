import { useEffect, useState } from "react";
import style from "./Matrix.module.css";
import axios from "axios";

export default (props) => {
  const [matrix, setMatrix] = useState(props.matrix);

  const [coherenceAssessment, setCoherenceAssessment] = useState(0);

  useEffect(() => {
    axios
      .post("http://localhost:5158/api/AssessConsistency", {
        matrix,
        size: props.size,
      })
      .then((res) => {
        console.log(res.data);

        setCoherenceAssessment(res.data);
      });
  }, [matrix]);

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
      next[y][x] = e.target.value * 1;
      next[x][y] = Math.round((1 / e.target.value) * 100000) / 100000;
      return next;
    });

    props.updateMatrix(matrix);
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
        <td className={style["signatures"]}>{props.headers[i]}</td>
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
    <div style={{ marginBottom: "2em" }}>
      <table className={style["matrix"]}>
        <thead>
          <tr>
            <th></th>
            {props.headers.map((obj, i) => (
              <th key={i}>{obj}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.pairwiseComparison != true ? renderMatrix() : renderReciprocalMatrix()}
        </tbody>
      </table>
      {coherenceAssessment >= 0.1 && (
        <span className={style["issue-message-box"]}>
          Оцінка узгодженості перевищує рекомендовану норму, рекомендація - перезаповнити
          таблицю з нуля!
        </span>
      )}
    </div>
  );
};
