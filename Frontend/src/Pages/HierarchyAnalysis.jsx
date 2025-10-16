import { useEffect, useState } from "react";
import { Matrix } from "../Components";

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

  const [alternativesMatrixesData, setAlternativesMatrixesData] = useState({
    matrixes: [
      [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
    ],
    headers: ["S1", "S2", "S3", "S4"],
    size: 4,
  });

  const [hasCoherenceIssues, setHasCoherenceIssues] = useState(false);

  //   useEffect(() => {
  //     alternativesMatrixesData.matrixes = Array(5);

  //     const empty = [
  // [1, 0, 0, 0],
  // [0, 1, 0, 0],
  // [0, 0, 1, 0],
  // [0, 0, 0, 1]
  //     ]

  //     setPairwiseMatrixesData({
  //         criteria: {
  //       matrix: [],
  //       size: 5,
  //     },
  //     alternatives: {
  //       matrixes: undefined,
  //       size: 4,
  //     },
  //     hasCoherenceIssues: false
  //     })

  //     alternativesMatrixesData.matrixes.forEach((element, i) => {
  //         element = [
  //             0
  //         ]
  //     })
  //   }, [])

  function handleUpdateCriteriaMatrix(updatedMatrix) {
    setCriteriaMatrixData((prev) => ({
      ...prev,
      matrix: updatedMatrix,
    }));

    console.log(criteriaMatrixData);
  }

  return (
    <section>
      <div>HierarchyAnalysis</div>
      <Matrix
        size={criteriaMatrixData.size}
        matrix={criteriaMatrixData.matrix}
        headers={criteriaMatrixData.headers}
        pairwiseComparison={true}
        updateMatrix={(matrix) => handleUpdateCriteriaMatrix(matrix)}
      />

      {alternativesMatrixesData.matrixes.map((obj, i) => (
        <Matrix
          key={i}
          size={alternativesMatrixesData.size}
          headers={alternativesMatrixesData.headers}
          pairwiseComparison={true}
          matrix={obj}
          updateMatrix={(matrix) => {}}
        />
      ))}
    </section>
  );
};

export default HierarchyAnalysis;
