"use client";

import { Brain, GitBranch, Activity, Radio, Ruler } from "lucide-react";

export function StudyDiagram({ title }: { title: string }) {
  const t = title.toLowerCase();

  if (t.includes("neuron") || t.includes("glial")) return (
    <div className="study-diagram">
      <div className="diagram-title"><Brain size={16}/> Neuron: follow the information</div>
      <div className="neuron-flow">
        <div className="diagram-node"><b>Dendrites</b><span>receive input</span></div><div className="diagram-arrow">→</div>
        <div className="diagram-node dark"><b>Soma</b><span>supports + integrates</span></div><div className="diagram-arrow">→</div>
        <div className="diagram-node"><b>Axon</b><span>carries activity</span></div><div className="diagram-arrow">→</div>
        <div className="diagram-node"><b>Terminals</b><span>communicate onward</span></div>
      </div>
      <div className="glia-strip"><strong>Glia</strong><span>support · insulation · regulation · maintenance</span></div>
    </div>
  );

  if (t.includes("synapse") || t.includes("neurotrans")) return (
    <div className="study-diagram">
      <div className="diagram-title"><Radio size={16}/> Chemical synapse</div>
      <div className="synapse-diagram">
        <div className="synapse-cell"><b>Presynaptic terminal</b><span>signal arrives</span><i>● ● ●</i></div>
        <div className="synapse-gap"><small>synaptic cleft</small><div>● → → →</div></div>
        <div className="synapse-cell"><b>Postsynaptic cell</b><span>receptors detect signal</span><i>◉ ◉ ◉</i></div>
      </div>
      <div className="diagram-sequence">electrical event → release → diffusion → receptor binding → response</div>
    </div>
  );

  if (t.includes("action potential")) return (
    <div className="study-diagram">
      <div className="diagram-title"><Activity size={16}/> Action potential sequence</div>
      <div className="ap-steps">
        <div><b>1</b><span>Resting</span></div><em>→</em><div><b>2</b><span>Threshold</span></div><em>→</em>
        <div className="hot"><b>3</b><span>Depolarise</span></div><em>→</em><div><b>4</b><span>Repolarise</span></div><em>→</em><div><b>5</b><span>Recover</span></div>
      </div>
      <div className="ap-chart"><span>+</span><div className="ap-line">╱╲</div><span>−</span><small>time →</small></div>
    </div>
  );

  if (t.includes("assessment") || t.includes("measurement") || t.includes("reliability") || t.includes("validity")) return (
    <div className="study-diagram">
      <div className="diagram-title"><Ruler size={16}/> Measurement: question → evidence</div>
      <div className="measure-flow">
        <div><b>Question</b><span>What do we want to know?</span></div><i>→</i>
        <div><b>Measure</b><span>What gives evidence?</span></div><i>→</i>
        <div><b>Score</b><span>What did we observe?</span></div><i>→</i>
        <div className="dark"><b>Interpret</b><span>What can we conclude?</span></div>
      </div>
      <div className="two-pill"><span><strong>Reliability</strong> consistency</span><span><strong>Validity</strong> defensible meaning/use</span></div>
    </div>
  );

  return (
    <div className="study-diagram">
      <div className="diagram-title"><GitBranch size={16}/> Learn it as a chain</div>
      <div className="generic-flow">
        <div><b>Definition</b><span>What is it?</span></div><i>→</i>
        <div><b>Mechanism</b><span>How does it work?</span></div><i>→</i>
        <div><b>Example</b><span>Where would you see it?</span></div><i>→</i>
        <div><b>Evidence</b><span>How would you know?</span></div>
      </div>
    </div>
  );
}
