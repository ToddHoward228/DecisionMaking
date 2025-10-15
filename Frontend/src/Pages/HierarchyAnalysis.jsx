import { Matrix } from "../Components";

const HierarchyAnalysis = () => {
  return (
    <section>
      <div>HierarchyAnalysis</div>
      <Matrix rows={4} cols={5} pairwiseComparison={true} result/>
    </section>
  );
};

export default HierarchyAnalysis;
