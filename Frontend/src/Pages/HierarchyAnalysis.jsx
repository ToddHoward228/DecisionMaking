import { useEffect, useState } from "react";
import { Matrix } from "../Components";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Legend,
  Bar,
  Rectangle,
} from "recharts";
import style from "./HierarchyAnalysis.module.css";

const HierarchyAnalysis = () => {
  const [criteriaMatrixData, setCriteriaMatrixData] = useState({
    matrix: getEmptyMatrix(5),
    //  [
    //   [1, 1.43, 2.0, 6.67, 1.25],
    //   [0.7, 1, 1.25, 2.0, 0.83],
    //   [0.5, 0.8, 1, 1.0, 0.5],
    //   [0.15, 0.5, 1.0, 1, 0.2],
    //   [0.8, 1.2, 2.0, 5.0, 1],
    // ],
    criteria: ["C1", "C2", "C3", "C4", "C5"],
  });

  const [addCriterionName, setAddCriterionName] = useState("");
  const [addAlternativeName, setAddAlternativeName] = useState("");
  const [criteria, setCriteria] = useState(["C1", "C2", "C3", "C4", "C5"]);
  const [alternatives, setAlternatives] = useState(["S1", "S2", "S3", "S4"]);
  const [alternativeMatrixesData, setAlternativeMatrixesData] = useState({
    matrixes: [
      [
        [1, 1.43, 1.67, 1.0],
        [0.7, 1, 1.25, 0.67],
        [0.6, 0.8, 1, 0.83],
        [1, 1.5, 1.2, 1],
      ],
      [
        [1, 1.25, 1.0, 1.0],
        [0.8, 1, 0.8, 0.8],
        [1, 1.25, 1, 1.0],
        [1, 1.25, 1, 1],
      ],
      [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ],
      [
        [1, 0.25, 1.25, 1.0],
        [4, 1, 4.0, 3.33],
        [0.8, 0.25, 1, 0.8],
        [1, 0.3, 1.25, 1],
      ],
      [
        [1, 4.0, 2.0, 1.05],
        [0.25, 1, 1.05, 0.26],
        [0.5, 0.95, 1, 0.5],
        [0.95, 3.9, 2, 1],
      ],
    ],
    // matrixes: [
    //   [
    //     [1, 0, 0, 0],
    //     [0, 1, 0, 0],
    //     [0, 0, 1, 0],
    //     [0, 0, 0, 1],
    //   ],
    //   [
    //     [1, 0, 0, 0],
    //     [0, 1, 0, 0],
    //     [0, 0, 1, 0],
    //     [0, 0, 0, 1],
    //   ],
    //   [
    //     [1, 0, 0, 0],
    //     [0, 1, 0, 0],
    //     [0, 0, 1, 0],
    //     [0, 0, 0, 1],
    //   ],
    //   [
    //     [1, 0, 0, 0],
    //     [0, 1, 0, 0],
    //     [0, 0, 1, 0],
    //     [0, 0, 0, 1],
    //   ],
    //   [
    //     [1, 0, 0, 0],
    //     [0, 1, 0, 0],
    //     [0, 0, 1, 0],
    //     [0, 0, 0, 1],
    //   ],
    // ],
    size: 4,
  });

  const [hasCoherenceIssues, setHasCoherenceIssues] = useState(false);
  const [priorityMatrix, setPriorityMatrix] = useState(undefined);
  const [rechartData, setRechartData] = useState(undefined);
  const [savedStatesList, setSavedStatesList] = useState();
  const [goal, setGoal] = useState("");

  const RADIAN = Math.PI / 180;
  const COLORS = ["#793DF5", "#3D3DF5", "#3D77F5", "#3DB1F5", "#31c9bcff", "#2bc9acff"];
  const COLORS_THEME1 = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    setSavedStatesList(
      JSON.parse(localStorage.getItem("saved_states"))?.map((obj) => obj?.name)
    );
  }, []);

  useEffect(() => {
    console.log(criteriaMatrixData);
  }, [criteriaMatrixData]);

  //   useEffect(() => {
  //     console.log(alternativeMatrixesData);
  //   }, [alternativeMatrixesData]);

  useEffect(() => {
    console.log(rechartData);
  }, [rechartData]);

  useEffect(() => {
    if (priorityMatrix != undefined) {
      setRechartData(
        priorityMatrix.map((obj, i) => {
          let sum = 0;

          obj.map((element) => {
            sum += element;
          });

          const scoreValues = Object.fromEntries(
            obj.map((element, i) => [criteria[i], element])
          );

          console.log(scoreValues);

          return {
            value: Math.round(sum * 100000) / 1000,
            name: alternatives[i],
            percentage: Math.round(sum * 100000) / 1000 + "%",
            ...scoreValues,
          };
        })
      );
    }
  }, [priorityMatrix]);

  function handleUpdateCriteriaMatrix(updatedMatrix) {
    setCriteriaMatrixData((prev) => ({
      ...prev,
      matrix: updatedMatrix,
    }));
  }

  function handleUpdateAlternativeMatrix(updatedMatrix, i) {
    setAlternativeMatrixesData((prev) => {
      const newAlternatives = [...prev.matrixes];

      newAlternatives[i] = updatedMatrix;

      return {
        ...prev,
        matrixes: newAlternatives,
      };
    });
  }

  function handleSaveState() {
    let prevState = JSON.parse(localStorage.getItem("saved_states")) ?? [];

    const state = {
      name: goal,
      criteria: criteria,
      criteriaMatrixData: criteriaMatrixData,
      alternatives: alternatives,
      alternativeMatrixesData: alternativeMatrixesData,
    };

    const foundIndex = prevState.findIndex((obj) => obj.name === goal);

    if (foundIndex === -1) {
      prevState.push(state);
    } else {
      alert("You already have saved state with this goal.");
      prevState = prevState.with(foundIndex, state);
    }

    localStorage.setItem("saved_states", JSON.stringify(prevState));

    setSavedStatesList(prevState.map((obj) => obj?.name));
  }

  function handleLoadState(stateName) {
    console.log("i'm entering");

    const currentState = JSON.parse(localStorage.getItem("saved_states"));

    const foundElement = currentState.find((obj) => obj.name == stateName);

    console.log(foundElement);

    setCriteria(foundElement.criteria);
    setAlternatives(foundElement.alternatives);
    setCriteriaMatrixData(foundElement.criteriaMatrixData);
    setAlternativeMatrixesData(foundElement.alternativeMatrixesData);
  }

  function handleAddCriterion() {
    const next = [...criteria, addCriterionName];

    console.log(next);

    setCriteria(next);

    setCriteriaMatrixData((prev) => ({
      ...prev,
      size: next.length,
      matrix: getEmptyMatrix(next.length),
    }));

    setAlternativeMatrixesData((prev) => ({
      ...prev,
      matrixes: [...next.map((obj) => getEmptyMatrix(alternatives.length))],
    }));
  }

  function handleDeleteCriterion(index) {
    const next = criteria.filter((_, i) => i !== index);

    console.log(next);

    setCriteria(next);

    setCriteriaMatrixData((prev) => ({
      ...prev,
      size: next.length,
      matrix: getEmptyMatrix(next.length),
    }));

    setAlternativeMatrixesData((prev) => ({
      ...prev,
      matrixes: [...next.map(() => getEmptyMatrix(alternatives.length))],
    }));
  }

  function handleAddAlternative() {
    const next = [...alternatives, addAlternativeName];

    setAlternatives(next);

    setAlternativeMatrixesData((prev) => ({
      ...prev,
      matrixes: [...criteria.map(() => getEmptyMatrix(next.length))],
    }));
  }

  function handleDeleteAlternative(index) {
    const next = alternatives.filter((_, i) => i !== index);

    setAlternatives(next);

    setAlternativeMatrixesData((prev) => ({
      ...prev,
      matrixes: [...criteria.map(() => getEmptyMatrix(next.length))],
    }));
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central">
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  function renderDiagrams() {
    return (
      <>
        <Matrix
          matrix={priorityMatrix}
          static={true}
          headers={criteria}
          labels={alternatives}
        />
        <div style={{ height: "800px", width: "100%" }}>
          <ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie
                activeShape={{
                  fill: "#a7547aff",
                }}
                data={rechartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={250}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}>
                {rechartData?.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.value}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ height: "400px", width: "100%", backgroundColor: "white" }}>
          <ResponsiveContainer>
            <BarChart
              width={500}
              height={300}
              data={rechartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" scale="auto" />
              <Legend />
              <Tooltip />
              {criteria.map((obj, i) => (
                <Bar
                  key={i}
                  dataKey={obj}
                  stackId="a"
                  fill={COLORS[i % COLORS.length]}
                  activeBar={<Rectangle stroke="black" />}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  return (
    <section>
      <h1>HierarchyAnalysis</h1>

      <input
        type="text"
        value={goal}
        placeholder="Enter your goal..."
        onChange={(e) => {
          setGoal(e.target.value);
        }}
      />

      <div className={style["container"]}>
        <div>
          <input
            type="text"
            value={addCriterionName}
            onChange={(e) => {
              setAddCriterionName(e.target.value);
            }}
          />
          <button onClick={handleAddCriterion}>Add Critetia</button>
        </div>
        <div className={style["container"]}>
          {criteria.map((obj, i) => (
            <div key={i}>
              <div className={style["element"]}>{obj}</div>
              <button
                onClick={() => {
                  handleDeleteCriterion(i);
                }}>
                Delete
              </button>
              <button>Update</button>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={addAlternativeName}
            onChange={(e) => {
              setAddAlternativeName(e.target.value);
            }}
          />
          <button onClick={handleAddAlternative}>Add Alternative</button>
        </div>
        <div className={style["container"]}>
          {alternatives.map((obj, i) => (
            <div key={i}>
              <div className={style["element"]}>{obj}</div>
              <button
                onClick={() => {
                  handleDeleteAlternative(i);
                }}>
                Delete
              </button>
              <button>Update</button>
            </div>
          ))}
        </div>
      </div>

      <div className={style["container"]}>
        <Matrix
          size={criteria.length}
          headers={criteria}
          labels={criteria}
          matrix={criteriaMatrixData.matrix}
          updateMatrix={handleUpdateCriteriaMatrix}
          pairwiseComparison={true}
        />
      </div>

      <div className={style["container"]}>
        {alternativeMatrixesData.matrixes.map((obj, i) => (
          <Matrix
            key={i}
            size={alternatives.length}
            headers={alternatives}
            labels={alternatives}
            matrix={obj}
            updateMatrix={(matrix) => handleUpdateAlternativeMatrix(matrix, i)}
            pairwiseComparison={true}
          />
        ))}
      </div>

      <button
        onClick={() => {
          axios
            .post("http://localhost:5158/api/decision", {
              criteriaCount: criteria.length,
              criteriaMatrix: criteriaMatrixData.matrix,
              alternativesCount: alternatives.length,
              alternativeMatrixes: alternativeMatrixesData.matrixes,
            })
            .then((res) => {
              setPriorityMatrix(res.data.decisionResult);
            });
        }}>
        Send
      </button>
      <button onClick={handleSaveState}>Save State</button>
      {savedStatesList?.map((obj, i) => (
        <div key={i} className={style["container"]}>
          <div className={style["element"]}>{obj}</div>
          <button onClick={() => handleLoadState(obj)}>Load</button>
        </div>
      ))}

      {priorityMatrix != undefined && renderDiagrams()}
    </section>
  );
};

function getEmptyMatrix(size) {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i == j ? 1 : 0))
  );
}

export default HierarchyAnalysis;
