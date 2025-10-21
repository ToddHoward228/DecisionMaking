import { useEffect, useState } from "react";
import style from "./Matrix.module.css";
import axios from "axios";
import { flushSync } from "react-dom";

export default (props) => {
  const [matrix, setMatrix] = useState(props.matrix);

  const [coherenceAssessment, setCoherenceAssessment] = useState(0);

  // useEffect(() => {
  //   if (props?.static != true) {
  //     axios
  //       .post("http://localhost:5158/api/AssessConsistency", {
  //         matrix,
  //         size: props.size,
  //       })
  //       .then((res) => {
  //         setCoherenceAssessment(res.data);
  //       });

  //     props.updateMatrix(matrix);
  //   }
  // }, [matrix]);

  // function handleMatrixChange(e, y, x) {
  //   setMatrix((prev) => {
  //     const next = prev.map((row) => row.slice());
  //     next[y][x] = e.target.value;
  //     return next;
  //   });
  // }

  // function handleMatrixChange() {
  //   axios
  //     .post("http://localhost:5158/api/AssessConsistency", {
  //       matrix,
  //       size: props.size,
  //     })
  //     .then((res) => {
  //       setCoherenceAssessment(res.data);
  //     });

  //   props.updateMatrix(matrix);
  // }

  function handleReciprocalMatrixChange(e, y, x) {

    const updated = props.matrix.map((row) => row.slice());
    updated[y][x] = parseFloat(e.target.value);
    updated[x][y] = Math.round((1 / e.target.value) * 100000) / 100000;

    axios
      .post("http://localhost:5158/api/AssessConsistency", {
        matrix: updated,
        size: props.size,
      })
      .then((res) => {
        setCoherenceAssessment(res.data);
      });

    props.updateMatrix(updated);
  }

  function renderMatrix() {
    return props.matrix?.map((row, i) => (
      <tr key={i}>
        {props.labels != undefined && (
          <td className={style["label"]}>{props.labels[i]}</td>
        )}
        {row?.map((obj, j) => (
          <td key={j}>
            <input
              type="number"
              value={props.matrix[i][j]}
              readOnly={props?.static}
              //   onChange={(e) => handleMatrixChange(e, i, j)}
            />
          </td>
        ))}
      </tr>
    ));
  }

  function renderReciprocalMatrix() {
    return props.matrix.map((row, i) => (
      <tr key={i}>
        {props.labels != undefined && (
          <td className={style["label"]}>{props.labels[i]}</td>
        )}
        {row.map((obj, j) => (
          <td key={j}>
            {i == j ? (
              <input type="number" value={obj} readOnly={true} />
            ) : (
              <input
                type="number"
                value={props.matrix[i][j]}
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
            {props.labels != undefined && <th></th>}
            {props.headers?.map((obj, i) => (
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
