import { useEffect, useState } from "react";
import { Matrix } from "../Components";
import axios from "axios";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const HierarchyAnalysis = () => {
  const [criteriaMatrixData, setCriteriaMatrixData] = useState({
    matrix: [
      [1, 1.43, 2.0, 6.67, 1.25],
      [0.7, 1, 1.25, 2.0, 0.83],
      [0.5, 0.8, 1, 1.0, 0.5],
      [0.15, 0.5, 1.0, 1, 0.2],
      [0.8, 1.2, 2.0, 5.0, 1],
    ],
    headers: ["C1", "C2", "C3", "C4", "C5"],
    size: 5,
  });

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
    headers: ["S1", "S2", "S3", "S4"],
    size: 4,
  });

  const [hasCoherenceIssues, setHasCoherenceIssues] = useState(false);

  const [priorityMatrix, setPriorityMatrix] = useState(undefined);

  const [rechartData, setRechartData] = useState(undefined);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    console.log(criteriaMatrixData);
  }, [criteriaMatrixData]);

  useEffect(() => {
    console.log(alternativeMatrixesData);
  }, [alternativeMatrixesData]);

  useEffect(() => {
    if (priorityMatrix != undefined) {
      setRechartData(
        priorityMatrix.map((obj, i) => {
          let sum = 0;
          obj.map((element) => {
            sum += element;
          });

          return { value: sum };
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

  return (
    <section>
      <div>HierarchyAnalysis</div>
      <Matrix
        size={criteriaMatrixData.size}
        headers={criteriaMatrixData.headers}
        labels={criteriaMatrixData.headers}
        matrix={criteriaMatrixData.matrix}
        updateMatrix={handleUpdateCriteriaMatrix}
        pairwiseComparison={true}
      />

      {alternativeMatrixesData.matrixes.map((obj, i) => (
        <Matrix
          key={i}
          size={alternativeMatrixesData.size}
          headers={alternativeMatrixesData.headers}
          labels={alternativeMatrixesData.headers}
          matrix={obj}
          updateMatrix={(matrix) => handleUpdateAlternativeMatrix(matrix, i)}
          pairwiseComparison={true}
        />
      ))}

      <button
        onClick={() => {
          axios
            .post("http://localhost:5158/api/decision", {
              criteriaCount: criteriaMatrixData.size,
              criteriaMatrix: criteriaMatrixData.matrix,
              alternativesCount: alternativeMatrixesData.size,
              alternativeMatrixes: alternativeMatrixesData.matrixes,
            })
            .then((res) => {
              setPriorityMatrix(res.data.decisionResult);
            });
        }}>
        Send
      </button>

      {priorityMatrix != undefined && (
        <>
          <Matrix
            matrix={priorityMatrix}
            static={true}
            headers={criteriaMatrixData.headers}
            labels={alternativeMatrixesData.headers}
          />
          <div style={{height:"400px", width:"400px"}}>
<ResponsiveContainer>
            <PieChart width={400} height={400}>
              <Pie
                data={rechartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label>
                {rechartData?.map((entry, index) => (
                  <Cell key={`cell-${entry.value}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          </div>
          
        </>
      )}
    </section>
  );
};

export default HierarchyAnalysis;
