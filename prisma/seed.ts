
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type TopicSeed = {
  subject: string;
  unit: number;
  unitTitle: string;
  slug: string;
  title: string;
  description: string;
  learningObjectives: string;
  quickExplanation: string;
  detailedNotes: string;
  keyTerms: string[];
  examples: string[];
  importantPsychologists: string[];
  examFocus: string;
  commonMistakes: string;
  quickRevision: string;
  flashcards: [string, string][];
  mcqs: { question: string; options: string[]; answerIndex: number; explanation: string; difficulty: string }[];
};

const makeMcqs = (
  q: string, options: string[], answerIndex: number, explanation: string
) => Array.from({length: 10}, (_, i) => ({
  question: i === 0 ? q : `${q} — practice question ${i + 1}`,
  options,
  answerIndex,
  explanation,
  difficulty: i < 4 ? "easy" : i < 8 ? "medium" : "hard"
}));

const topics: TopicSeed[] = [
  {
    subject: "Fundamentals of Psychology",
    unit: 1,
    unitTitle: "Foundations of Psychology",
    slug: "meaning-and-goals-of-psychology",
    title: "Meaning and Goals of Psychology",
    description: "Psychology is the systematic study of behaviour and mental processes.",
    learningObjectives: "Understand what psychology studies, its scientific character, and its major goals.",
    quickExplanation: "Psychology asks evidence-based questions about behaviour, experience, cognition, emotion and relationships. What psychology is trying to explain. Behaviour includes observable actions, while mental processes include attention, memory, reasoning, emotion, language and perception. These domains overlap: a student's visible behaviour may reflect changing attention, motivation, expectations or social context. Why the scientific approach matters. People are excellent pattern-finders, but intuition can be distorted by selective attention, hindsight and confirmation bias. Psychology therefore uses systematic observation, operational definitions, measurement, comparison and, where appropriate, experiments. A scientific method does not make every question simple; it makes the reasoning inspectable and open to correction. The four classic goals. Description asks what is happening. Explanation asks why it happens. Prediction asks when or under what conditions it is likely to happen. Influence or control refers to using psychological knowledge to change conditions or behaviour responsibly. In practice, strong psychological work moves through these goals rather than pretending that one observation proves a universal rule.",
    detailedNotes: "The classic goals of psychology are to describe, explain, predict and influence behaviour. Modern psychology uses observation, experiments, interviews, psychometric methods, biological measures and statistical reasoning. Scientific psychology is broader than the study of mental illness.",
    keyTerms: ["Psychology", "Behaviour", "Mental processes", "Description", "Explanation", "Prediction"],
    examples: ["Recording how often students check their phones is descriptive research.", "Testing whether sleep loss changes attention addresses a causal question."],
    importantPsychologists: ["Wilhelm Wundt", "William James"],
    examFocus: "Know the four classic goals: describe, explain, predict and influence/control.",
    commonMistakes: "Psychology is not simply common sense, and it is not identical to psychiatry.",
    quickRevision: "Psychology studies behaviour and mental processes using systematic methods.",
    flashcards: [
      ["What is psychology?", "The systematic scientific study of behaviour and mental processes."],
      ["What are psychology's classic goals?", "Describe, explain, predict and influence/control behaviour."],
      ["What does prediction mean?", "Using evidence about known patterns to anticipate outcomes."]
    ],
    mcqs: makeMcqs(
      "Which is a classic goal of psychology?",
      ["Describe behaviour", "Read minds", "Predict lottery numbers", "Prove every theory"],
      0,
      "Description is one of psychology's classic goals."
    )
  },
  {
    subject: "Fundamentals of Psychology",
    unit: 1,
    unitTitle: "Foundations of Psychology",
    slug: "history-of-psychology",
    title: "History of Psychology",
    description: "Psychology developed as an academic discipline through interactions among philosophy, physiology and experimental methods.",
    learningObjectives: "Trace major milestones from philosophical inquiry to experimental psychology.",
    quickExplanation: "Questions about mind and behaviour are ancient, but experimental methods helped psychology become a distinct academic discipline. Before psychology became an independent department-based discipline, philosophers debated knowledge, perception, consciousness and the nature of mind. Physiologists were also developing methods for studying sensation and the nervous system. The emergence of psychology therefore involved several intellectual streams coming together. Wundt and the laboratory tradition. Wilhelm Wundt's laboratory in Leipzig, established in 1879, is commonly treated as a landmark because experimental work on psychological processes was given a formal institutional home. It is more accurate to call this a landmark in institutional and experimental psychology than to claim that all psychological thought began that year. Competing traditions. Structuralism emphasized the elements of conscious experience and the use of trained introspection. Functionalism asked what mental processes and behaviour do, especially in adaptation. Psychoanalysis focused strongly on unconscious processes and conflict. Behaviourism shifted attention toward observable behaviour and learning. Gestalt psychologists argued that organized wholes matter. Cognitive psychology later returned mental processes such as memory and attention to the center of experimental study. Why this history matters. The schools disagree, but their questions still help students understand why modern psychology has multiple methods. Contemporary psychology is plural: laboratory experiments, behavioural methods, cognitive models, neuroscience, psychometrics and qualitative approaches can answer different kinds of questions.",
    detailedNotes: "Wilhelm Wundt's Leipzig laboratory, established in 1879, is commonly treated as a landmark in psychology's institutional history. Different traditions later emphasized different questions: structuralism examined elements of experience, functionalism emphasized functions, psychoanalysis emphasized unconscious processes, behaviourism emphasized observable behaviour and learning, Gestalt psychology emphasized organized wholes, and cognitive psychology renewed scientific interest in mental processes.",
    keyTerms: ["Wundt", "Functionalism", "Behaviourism", "Gestalt", "Psychoanalysis", "Cognitive psychology"],
    examples: ["A history question may ask why 1879 is treated as a landmark.", "A comparison question may ask how behaviourism differed from psychoanalysis."],
    importantPsychologists: ["Wilhelm Wundt", "William James", "Sigmund Freud", "John B. Watson", "B.F. Skinner"],
    examFocus: "Remember 1879 and Leipzig as the conventional landmark associated with Wundt.",
    commonMistakes: "Saying psychology did not exist before 1879 oversimplifies its philosophical and scientific roots.",
    quickRevision: "Psychology's history contains multiple traditions rather than one straight line.",
    flashcards: [
      ["Why is 1879 important?", "It is the conventional landmark associated with Wundt's Leipzig laboratory."],
      ["What did functionalism emphasize?", "The functions or purposes of mental processes and behaviour."],
      ["What did behaviourism emphasize?", "Observable behaviour and learning processes."]
    ],
    mcqs: makeMcqs(
      "Which year is commonly associated with Wundt's Leipzig laboratory?",
      ["1779", "1879", "1979", "1897"],
      1,
      "1879 is the conventional date linked to Wundt's Leipzig laboratory."
    )
  },
  {
    subject: "Biological Basis of Behaviour",
    unit: 1,
    unitTitle: "Neurons and Nervous System",
    slug: "neurons-and-glia",
    title: "Neurons and Glial Cells",
    description: "Neurons are specialized cells that communicate information; glial cells support and regulate neural functioning.",
    learningObjectives: "Identify major neuronal structures and distinguish neurons from glial cells.",
    quickExplanation: "Dendrites commonly receive signals, the soma supports the cell, and the axon conducts electrical changes toward terminal regions.",
    detailedNotes: "Neurons communicate through electrical and chemical processes. A typical neuron has dendrites, a soma, an axon and terminal regions. Myelin surrounds many axons and increases conduction efficiency. Glial cells have active roles in support, insulation, metabolic regulation and maintenance of the neural environment. Dendrites. These branching structures commonly receive input from other neurons. Their branching pattern increases the area available for receiving signals, although not every dendrite simply acts as an on/off input line. Soma. The cell body contains the nucleus and supports the metabolic machinery of the neuron. Incoming activity is integrated with the rest of the cell's physiological state. Axon and terminals. The axon carries electrical activity away from the cell body toward terminal regions. At terminals, the neuron can communicate with another cell, often by releasing neurotransmitter at a chemical synapse. Myelin and glia. Myelin is an insulating structure around many axons that improves the efficiency and speed of electrical conduction. In the central and peripheral nervous systems, different glial cell types contribute to insulation, metabolic support, immune functions, extracellular regulation and other aspects of neural health. The key idea is division of labour. A neuron is not a single undifferentiated wire: different cellular compartments contribute to receiving, integrating, conducting and communicating information.",
    keyTerms: ["Neuron", "Dendrite", "Soma", "Axon", "Myelin", "Glia"],
    examples: ["A problem affecting myelin can disrupt efficient neural signalling.", "Different neuronal structures specialize in different parts of information transmission."],
    importantPsychologists: ["Santiago Ramón y Cajal"],
    examFocus: "Know the basic direction and function of dendrites, soma, axon and terminals.",
    commonMistakes: "Glia are not merely passive 'glue'; they perform active biological functions.",
    quickRevision: "Neurons transmit information; glia support and regulate the neural environment.",
    flashcards: [
      ["What does the soma do?", "It is the cell body that maintains cellular functions."],
      ["What is myelin?", "An insulating structure around many axons that increases conduction efficiency."],
      ["What are glia?", "Cells with multiple support and regulatory functions in nervous tissue."]
    ],
    mcqs: makeMcqs(
      "Which structure commonly receives signals?",
      ["Dendrites", "Myelin", "Nucleus only", "Blood vessels"],
      0,
      "Dendrites commonly receive incoming neural signals."
    )
  },
  {
    subject: "Biological Basis of Behaviour",
    unit: 1,
    unitTitle: "Neurons and Nervous System",
    slug: "synapses-and-neurotransmitters",
    title: "Synapses and Neurotransmitters",
    description: "Neurons communicate across synapses through electrical and chemical mechanisms.",
    learningObjectives: "Explain basic synaptic transmission and distinguish neurotransmitters from receptors.",
    quickExplanation: "At a chemical synapse, neurotransmitters are released from one cell and bind receptors on another cell.",
    detailedNotes: "A chemical synapse includes a presynaptic terminal, a synaptic cleft and a postsynaptic membrane. A simple sequence is useful for exams: electrical activity reaches the presynaptic terminal → vesicles release neurotransmitter → neurotransmitter crosses the synaptic cleft → receptors detect it → the postsynaptic cell changes its activity. The result can increase or decrease the likelihood of further neural activity depending on receptor type and circuit context. Neurotransmitter is not the same thing as receptor. The neurotransmitter is the signalling molecule; the receptor is the receiving protein or cellular structure that detects the signal. This distinction matters because one neurotransmitter can produce different effects in different tissues when it acts at different receptor subtypes. Signal termination. Neurotransmitter action may end through reuptake, enzymatic breakdown or diffusion. Reuptake transports transmitter back into a cell; enzymatic breakdown chemically alters a molecule; diffusion spreads molecules away from the active site. Why simple slogans fail. Saying 'dopamine does reward' or 'serotonin creates happiness' hides the complexity of receptor systems, pathways and behaviour. Neurochemical systems contribute to psychological processes, but they do not map one-to-one onto single emotions or personality traits. Neurotransmitters can bind receptors and change the activity of the receiving cell. Their effects depend on receptor type and circuit context. Neurotransmitter action may end through reuptake, enzymatic breakdown or diffusion.",
    keyTerms: ["Synapse", "Neurotransmitter", "Receptor", "Presynaptic", "Postsynaptic", "Reuptake"],
    examples: ["A reuptake inhibitor changes how long certain neurotransmitters remain available in the synaptic space.", "The same neurotransmitter can contribute to different effects in different circuits."],
    importantPsychologists: ["Otto Loewi", "Bernard Katz"],
    examFocus: "Know presynaptic vs postsynaptic, transmitter vs receptor, and reuptake.",
    commonMistakes: "Avoid reducing a neurotransmitter to a single simplistic effect such as 'the happiness chemical'.",
    quickRevision: "Synapses are communication junctions; neurotransmitter effects depend on receptors and neural context.",
    flashcards: [
      ["What is a neurotransmitter?", "A chemical messenger released by a neuron that can affect another cell."],
      ["What is reuptake?", "Transport of neurotransmitter back into a cell, helping clear the synaptic space."],
      ["What is a receptor?", "A cellular protein or structure that detects a signalling molecule."]
    ],
    mcqs: makeMcqs(
      "What does reuptake mean?",
      ["Returning a neurotransmitter into a cell", "Creating a neuron", "Breaking myelin", "Stopping all brain activity"],
      0,
      "Reuptake is one mechanism for clearing neurotransmitter from the synaptic space."
    )
  },
  {
    subject: "Psychological Assessment",
    unit: 1,
    unitTitle: "Foundations of Assessment",
    slug: "what-is-psychological-assessment",
    title: "What Is Psychological Assessment?",
    description: "Psychological assessment is a systematic process of collecting and integrating information to answer a defined psychological question.",
    learningObjectives: "Distinguish assessment from a single psychological test and identify basic principles of responsible assessment.",
    quickExplanation: "Assessment may combine interviews, observations, standardized tests and other appropriate information.",
    detailedNotes: "A psychological test is one tool within the broader assessment process. Start with the referral question. A responsible assessor first identifies what needs to be understood: cognitive functioning, symptoms, personality characteristics, adaptive behaviour, educational needs or another defined question. The method should follow the question rather than forcing every client into the same test battery. Assessment versus testing. Testing refers to administering and interpreting a standardized measure. Assessment is broader and may integrate an interview, behavioural observations, standardized tests, collateral information and records. No single score should be treated as the whole person. Reliability and validity. Reliability is about consistency and precision of measurement. Validity concerns whether evidence supports the interpretation and use being made of scores. A measure can be consistent without measuring what the assessor intends. Therefore both concepts matter. Standardization and context. Standardized administration and scoring make results more comparable. Interpretation still depends on norms, language, culture, referral context, developmental level and the characteristics of the measure. Ethical practice also requires privacy, appropriate consent and careful communication of results. Responsible assessment requires a clear referral question, appropriate methods, standardized administration where relevant, and careful interpretation. Reliability concerns measurement consistency; validity concerns evidence supporting interpretations and uses of scores.",
    keyTerms: ["Assessment", "Test", "Validity", "Reliability", "Standardization", "Referral question"],
    examples: ["A clinician may combine an interview, behavioural observation and a standardized measure.", "A high questionnaire score should not automatically be treated as a diagnosis."],
    importantPsychologists: ["David Wechsler", "Anne Anastasi"],
    examFocus: "Assessment is broader than testing, and scores must be interpreted in context.",
    commonMistakes: "A high or low test score does not automatically establish a diagnosis.",
    quickRevision: "Assessment answers a question by integrating multiple appropriate sources of information.",
    flashcards: [
      ["Assessment vs test?", "Assessment is the broader information-integration process; a test is one measurement tool."],
      ["What is reliability?", "Consistency or precision of measurement."],
      ["What is validity?", "Evidence supporting intended interpretations or uses of scores."]
    ],
    mcqs: makeMcqs(
      "Psychological assessment is best understood as:",
      ["A broader process of integrating information", "Only an IQ score", "Only a diagnosis", "A personality horoscope"],
      0,
      "Assessment is broader than a single test and integrates information to answer a defined question."
    )
  },
  {
    subject: "Indian Wisdom for Nation Building",
    unit: 1,
    unitTitle: "Indian Knowledge and Values",
    slug: "indian-knowledge-systems-overview",
    title: "Indian Knowledge Systems: An Overview",
    description: "Indian knowledge traditions include diverse philosophical, scientific, linguistic, artistic and ethical traditions.",
    learningObjectives: "Recognize the diversity of Indian intellectual traditions and compare concepts without flattening historical differences.",
    quickExplanation: "Indian knowledge traditions are plural rather than one single doctrine.",
    detailedNotes: "Indian intellectual history includes multiple schools of philosophy and work in medicine, mathematics, astronomy, linguistics, literature, arts and ethics. The phrase 'Indian knowledge traditions' is broad. It should not be used as though every Indian school or period shared one single theory of reality, self or human behaviour. Different philosophical and disciplinary traditions developed different questions, concepts and methods. For psychology, comparisons can be intellectually useful when they are precise. For example, a student can compare descriptions of attention or contemplative practice with modern psychological theories of attention or emotion regulation. But the concepts may serve different purposes and may not be empirically interchangeable. A good academic comparison asks: What did the original tradition claim? What was its historical context? What does modern research actually measure? Where are the similarities, and where do the concepts diverge? This protects the student from both uncritical celebration and unnecessary dismissal. The central skill here is methodological humility: make useful comparisons, but do not claim more than the evidence or historical source supports. For psychology students, comparisons involving self, attention, suffering or contemplative practice can be useful, but modern psychological constructs should not automatically be treated as identical to historical philosophical concepts.",
    keyTerms: ["Pluralism", "Knowledge traditions", "Ethics", "Contemplation", "Philosophy", "Historical context"],
    examples: ["A careful comparison can examine attention in contemplative practice while respecting differences in aims and concepts.", "A historical claim should be separated from a modern scientific interpretation."],
    importantPsychologists: [],
    examFocus: "Emphasize diversity and methodological humility when comparing traditions.",
    commonMistakes: "Do not treat 'Indian culture' as one homogeneous theory.",
    quickRevision: "Indian knowledge traditions are diverse; comparisons should preserve historical and conceptual context.",
    flashcards: [
      ["Why use the plural 'traditions'?", "Because Indian intellectual history contains multiple schools and disciplines."],
      ["What is methodological humility?", "Recognizing the limits of cross-cultural or cross-historical comparisons."],
      ["Why preserve historical context?", "Concepts can have different meanings and purposes in different traditions."]
    ],
    mcqs: makeMcqs(
      "Indian knowledge traditions are best described as:",
      ["Uniform and identical", "Diverse and plural", "Only religious", "Only mathematical"],
      1,
      "Indian intellectual traditions encompass multiple schools, disciplines and historical contexts."
    )
  }
];

// Expanded Semester 1 study map. The university's public course page confirms
// the subject list; these are structured learning topics, not claims about the
// university's official unit numbering.
function mcqSet(topic: string, key: string, options: string[], answerIndex: number, explanation: string) {
  const stems = [
    `Which statement best describes ${topic}?`,
    `Which idea is central to ${topic}?`,
    `A student revising ${topic} should remember that:`,
    `Which option is most consistent with ${topic}?`,
    `Which statement would be safest on an undergraduate exam about ${topic}?`,
    `Which distinction matters most when studying ${topic}?`,
    `Which example fits ${topic} best?`,
    `Which claim about ${topic} is most defensible?`,
    `What should you avoid oversimplifying when explaining ${topic}?`,
    `Which answer would earn the most precise explanation of ${topic}?`
  ];
  return stems.map((question, i) => ({
    question,
    options,
    answerIndex,
    explanation: explanation + ` Key point: ${key}.`,
    difficulty: i < 3 ? "easy" : i < 7 ? "medium" : "hard"
  }));
}

function topicPack(
  subject: string,
  unit: number,
  unitTitle: string,
  slug: string,
  title: string,
  description: string,
  objectives: string,
  quick: string,
  notes: string,
  keyTerms: string[],
  examples: string[],
  psychologists: string[],
  exam: string,
  mistakes: string,
  revision: string,
  flashcards: [string,string][],
  mcqKey: string,
  mcqOptions: string[],
  mcqAnswer: number,
  mcqExplanation: string
): TopicSeed {
  const sub = keyTerms.slice(0,4);
  const mindMap:any[] = [
    { id:"root", label:title, detail:"Central idea", level:0 },
    { id:"b1", label:sub[0]||"Core idea", parent:"root", detail:examples[0]||"Definition", level:1 },
    { id:"b2", label:sub[1]||"Process", parent:"root", detail:examples[1]||"How it works", level:1 },
    { id:"b3", label:sub[2]||"Evidence", parent:"root", detail:exam, level:1 },
    { id:"b4", label:sub[3]||"Application", parent:"root", detail:revision, level:1 },
    { id:"s1", label:"Definition", parent:"b1", detail:quick, level:2 },
    { id:"s2", label:"Example", parent:"b1", detail:examples[0]||"", level:2 },
    { id:"s3", label:"Distinction", parent:"b2", detail:mistakes, level:2 },
    { id:"s4", label:"Exam cue", parent:"b3", detail:exam, level:2 },
    { id:"s5", label:"Recall", parent:"b4", detail:revision, level:2 }
  ];
  return {
    subject, unit, unitTitle, slug, title, description, learningObjectives: objectives,
    quickExplanation: quick, detailedNotes: notes, keyTerms, examples,
    importantPsychologists: psychologists, examFocus: exam, commonMistakes: mistakes,
    quickRevision: revision, mindMap, flashcards,
    mcqs: mcqSet(title, mcqKey, mcqOptions, mcqAnswer, mcqExplanation)
  };
}

topics.push(
  topicPack(
    "Fundamentals of Psychology",2,"Research Methods","scientific-method-and-psychology",
    "Scientific Method in Psychology",
    "How psychologists convert questions into observations and testable explanations.",
    "Define operationalization, distinguish a question from a hypothesis, and explain why replication and evidence matter.",
    "A scientific approach turns broad questions into measurable concepts and designs studies that can challenge predictions.",
    "Start with a question. Define the variables in ways that can actually be observed or measured. Generate a hypothesis that makes a testable prediction. Collect data with a method suited to the question, analyze the evidence and compare it with the prediction. A useful psychological claim should be open to being wrong. Replication is important because a single result can be affected by sampling, measurement or chance.\n\nScientific method does not mean that every psychological question needs a laboratory experiment. Observational, correlational, qualitative and experimental designs each answer different questions. The key is matching the method to the claim.",
    ["Question","Operational definition","Hypothesis","Measurement","Replication","Evidence"],
    ["Defining 'attention' as reaction time on a specified task makes it measurable.","Repeating a study on a new sample tests whether a finding is robust."],
    ["Wilhelm Wundt"],"Explain the sequence from question → operationalization → hypothesis → data → interpretation → replication.",
    "A hypothesis is not the same thing as a vague prediction, and correlation is not automatically causal.",
    "Good psychological science is testable, measurable and open to correction.",
    [["What is an operational definition?","A precise description of how a construct will be measured or manipulated in a study."],["Why replicate?","To test whether a finding is robust across samples, settings or researchers."],["What makes a hypothesis scientific?","It should make a testable prediction that could be supported or contradicted by evidence."]],
    "A testable hypothesis",["A testable hypothesis","A personal opinion","A guaranteed conclusion","A definition with no prediction"],0,
    "A hypothesis should produce a prediction that can be confronted with evidence."
  ),
  topicPack(
    "Fundamentals of Psychology",2,"Research Methods","observation-and-case-study",
    "Observation and Case Study",
    "Descriptive approaches used to study behaviour in natural or focused contexts.",
    "Differentiate naturalistic observation, participant observation and case-study approaches and identify their limits.",
    "Observation records behaviour as it occurs; a case study develops a detailed account of an individual, group or situation.",
    "Naturalistic observation can preserve real-world behaviour because the researcher studies people in a setting without arranging the focal behaviour experimentally. Researchers still need operational definitions, sampling rules and observer training. Participant observation places the researcher more directly within the setting and raises additional questions about reactivity and interpretation.\n\nA case study examines one case or a small number of cases in depth. It can generate rich hypotheses and reveal unusual patterns, but a single case cannot automatically establish population-level generalization or causality. Descriptive methods are strongest when the research question is 'what is happening?' rather than 'did X cause Y?'",
    ["Naturalistic observation","Reactivity","Case study","Observer bias","Description"],
    ["A researcher records children's cooperative behaviour during free play.","A clinician develops an in-depth case formulation from interviews and records."],
    ["None"],"Know the main strengths and limits of descriptive designs.",
    "Detailed information is not the same as causal evidence.",
    "Observation describes behaviour; case studies provide depth but limited generalizability.",
    [["What is naturalistic observation?","Systematic observation of behaviour in a real-world setting."],["What is a case study?","An in-depth investigation of a person, group or case."],["What is reactivity?","A change in behaviour because people know they are being observed."]],
    "Naturalistic observation",["A descriptive method","A randomized drug trial","A statistical test","A diagnostic label"],0,
    "Naturalistic observation is primarily descriptive and takes place in a real-world context."
  ),
  topicPack(
    "Fundamentals of Psychology",3,"Learning","classical-conditioning",
    "Classical Conditioning",
    "Learning through associations between stimuli.",
    "Explain acquisition, unconditioned and conditioned stimuli/responses, extinction and spontaneous recovery.",
    "A previously neutral stimulus can come to elicit a response after being repeatedly paired with a stimulus that already elicits that response.",
    "In Pavlovian conditioning, an unconditioned stimulus (UCS) naturally elicits an unconditioned response (UCR). A neutral stimulus becomes a conditioned stimulus (CS) after pairing and then elicits a conditioned response (CR). Acquisition refers to initial learning. Extinction occurs when the conditioned stimulus is repeatedly presented without the unconditioned stimulus, weakening the conditioned response. Spontaneous recovery refers to the return of a previously extinguished response after a rest period.\n\nClassical conditioning helps explain some emotional and physiological learning, but it should not be treated as a complete theory of all human behaviour. Contingency, timing and context influence learning.",
    ["UCS","UCR","CS","CR","Acquisition","Extinction","Spontaneous recovery"],
    ["Pavlov paired a tone with food in dogs.","A student may develop anxiety to a place associated with a previous stressful event."],
    ["Ivan Pavlov"],"Be able to identify UCS, UCR, CS and CR in a new example.",
    "Do not confuse extinction with forgetting; spontaneous recovery shows the old association can reappear.",
    "UCS naturally triggers UCR; pairing makes CS trigger CR.",
    [["What is acquisition?","The initial learning of a conditioned association."],["What is extinction?","Weakening of a conditioned response when the CS is repeatedly presented without the UCS."],["Who is strongly associated with classical conditioning?","Ivan Pavlov"]],
    "CS",["Conditioned stimulus","Unconditioned stimulus","Conditioned response","Unconditioned response"],0,
    "The conditioned stimulus is the previously neutral cue that acquires signaling value."
  ),
  topicPack(
    "Fundamentals of Psychology",3,"Learning","operant-conditioning",
    "Operant Conditioning",
    "Learning in which consequences influence the future likelihood of behaviour.",
    "Differentiate reinforcement from punishment and positive from negative consequences.",
    "Operant conditioning asks what happens after a behaviour and how those consequences change its future frequency.",
    "Reinforcement increases behaviour; punishment decreases behaviour. Positive means something is added, while negative means something is removed. Therefore positive reinforcement adds a rewarding consequence, negative reinforcement removes an aversive condition, positive punishment adds an aversive consequence, and negative punishment removes a desirable consequence.\n\nThe words positive and negative do not mean good and bad. Schedules of reinforcement also matter: fixed or variable, ratio or interval schedules produce different patterns of responding. In applied settings, ethical practice matters because changing behaviour should not ignore autonomy or unintended effects.",
    ["Reinforcement","Punishment","Positive","Negative","Contingency","Schedule"],
    ["A seatbelt alarm stops when the seatbelt is fastened: removal of an aversive signal can reinforce fastening.","A student earns extra break time after completing assigned work: a consequence can increase completion."],
    ["B.F. Skinner"],"Learn the 2×2 distinction: reinforcement/punishment × positive/negative.",
    "Negative reinforcement is not punishment.",
    "Reinforcement raises behaviour; punishment lowers it. Positive adds; negative removes.",
    [["What does reinforcement do?","Increase the future probability of a behaviour."],["What does punishment do?","Decrease the future probability of a behaviour."],["What does negative mean in operant conditioning?","A stimulus or consequence is removed."]],
    "Reinforcement increases behaviour",["Reinforcement increases behaviour","Reinforcement decreases behaviour","Punishment always increases behaviour","Positive always means pleasant"],0,
    "The defining feature of reinforcement is an increase in the future likelihood of behaviour."
  ),
  topicPack(
    "Biological Basis of Behaviour",2,"Brain and Nervous System","central-and-peripheral-nervous-system",
    "Central and Peripheral Nervous Systems",
    "The nervous system is organized into interacting systems with different anatomical and functional roles.",
    "Distinguish the CNS from the PNS and identify broad somatic and autonomic divisions.",
    "The central nervous system includes the brain and spinal cord; the peripheral nervous system connects the CNS with the rest of the body.",
    "The central nervous system processes and integrates information. The peripheral nervous system carries information toward and away from the CNS. Broadly, the somatic nervous system is associated with voluntary movement and sensory information, while the autonomic nervous system regulates many involuntary functions. The autonomic system is often divided into sympathetic and parasympathetic branches, which frequently exert complementary influences.\n\nThese are organizational distinctions rather than isolated boxes. Real behaviour depends on interactions across brain regions, spinal pathways, peripheral nerves and bodily systems.",
    ["CNS","PNS","Somatic","Autonomic","Sympathetic","Parasympathetic"],
    ["Heart rate can change with autonomic activity.","A hand movement depends on communication between brain, spinal pathways and peripheral nerves."],
    ["None"],"Be able to expand CNS/PNS and distinguish somatic vs autonomic.",
    "The autonomic nervous system is not simply the 'stress system'. Both branches have broader roles.",
    "CNS = brain + spinal cord; PNS = neural connections outside CNS.",
    [["What is the CNS?","The brain and spinal cord."],["What is the PNS?","Neural structures outside the brain and spinal cord that connect them with the body."],["What does the autonomic system regulate?","Many involuntary physiological functions."]],
    "Brain and spinal cord",["Brain and spinal cord","Only muscles","Only glands","Only sensory receptors"],0,
    "The CNS consists of the brain and spinal cord."
  ),
  topicPack(
    "Biological Basis of Behaviour",2,"Brain and Nervous System","lobes-and-cortical-functions",
    "Lobes and Cortical Functions",
    "A high-level guide to major cerebral cortex regions and their commonly taught functions.",
    "Locate frontal, parietal, temporal and occipital lobes and give cautious examples of associated functions.",
    "Different cortical regions are specialized to some degree, but complex behaviour emerges from networks rather than one isolated 'brain spot'.",
    "The frontal lobes are involved in executive control, planning, motor functions and aspects of language and social behaviour. The parietal lobes contribute to somatosensory processing and spatial integration. The temporal lobes are involved in auditory processing, memory and aspects of language. The occipital lobes are central to visual processing.\n\nStudents often memorize one label per lobe, but good answers acknowledge distributed processing. Brain functions are not always exclusive to one region, and deficits after injury can reflect network disruption rather than loss of a single isolated faculty.",
    ["Frontal lobe","Parietal lobe","Temporal lobe","Occipital lobe","Cortex","Network"],
    ["A visual-processing problem can involve occipital networks.","Planning and inhibition draw on frontal systems rather than a single tiny point."],
    ["Paul Broca","Carl Wernicke"],"Know the four major lobes and use cautious language such as 'associated with'.",
    "Do not write that one lobe 'does' a complex behaviour by itself.",
    "Cortex functions are specialized but distributed: frontal plan, parietal integrate touch/space, temporal hear/memory/language, occipital vision.",
    [["Which lobe is strongly associated with visual processing?","Occipital."],["Which lobe is strongly associated with executive control?","Frontal."],["Why say 'associated with' rather than 'entirely responsible for'?","Complex behaviour depends on distributed networks."]],
    "Occipital lobe",["Occipital lobe","Frontal lobe","Temporal lobe","Parietal lobe"],0,
    "The occipital cortex is central to visual processing."
  ),
  topicPack(
    "Biological Basis of Behaviour",3,"Neural Communication","action-potential-and-membrane",
    "Action Potential and Neural Signalling",
    "A neuron can produce a rapid electrical event when membrane conditions reach threshold.",
    "Explain resting potential, threshold and the basic sequence of an action potential.",
    "An action potential is a rapid change in membrane potential that propagates along an axon once threshold is reached.",
    "At rest, a neuron's membrane has a voltage difference maintained by ion distributions and membrane permeability. Depolarization occurs when excitatory inputs move the membrane toward threshold. Once threshold is reached, voltage-gated channels produce the rapid action potential. Repolarization follows, with a brief period in which firing is less likely.\n\nAction potentials are often described as all-or-none events. What varies strongly is the rate and pattern of firing, not an arbitrary 'strength' of one action potential. Myelination can influence conduction speed along many axons.",
    ["Resting potential","Threshold","Depolarization","Repolarization","All-or-none","Axon"],
    ["A neuron may integrate many inputs before reaching threshold.","Myelination can increase the speed of propagation along an axon."],
    ["Alan Hodgkin","Andrew Huxley"],"Know threshold, depolarization, repolarization and all-or-none.",
    "The all-or-none principle does not mean every neuron fires continuously or identically.",
    "Inputs are integrated; threshold triggers the action potential; recovery follows.",
    [["What is threshold?","A membrane potential level at which an action potential is triggered."],["What happens during depolarization?","The membrane potential becomes less negative as ion permeability changes."],["Are individual action potentials generally graded in amplitude?","No; they are commonly described as all-or-none."]],
    "Threshold",["The level needed to trigger an action potential","A neurotransmitter","A receptor","A glial cell"],0,
    "Threshold refers to the membrane condition needed to trigger an action potential."
  ),
  topicPack(
    "Biological Basis of Behaviour",4,"Biology and Behaviour","genes-and-environment",
    "Genes and Environment",
    "Behaviour reflects interactions between biological inheritance and environments across development.",
    "Explain why heritability is a population statistic and why genes do not function independently of environments.",
    "Genes can influence developmental tendencies, but behaviour is produced through dynamic interaction among biology, experience and context.",
    "Genes are segments of DNA that contribute to biological development and function through complex molecular pathways. Behavioural genetics asks how variation in traits relates to genetic differences, but it does not imply that a trait is genetically fixed. Heritability is a statistic about variation within a population under particular environmental conditions; it is not the percentage of one person's behaviour caused by genes.\n\nGene–environment interaction means that the effect of one factor can depend on the other. Developmental systems are therefore dynamic: nutrition, stress, learning, relationships and social context can alter how biological tendencies are expressed.",
    ["Genes","Environment","Heritability","Gene–environment interaction","Development","Plasticity"],
    ["A genetically influenced tendency can be expressed differently across environments.","Two people with similar biological predispositions can develop differently under different experiences."],
    ["None"],"Distinguish genetic influence from genetic determinism and define heritability carefully.",
    "A high heritability estimate does not mean an individual trait is unchangeable.",
    "Genes matter, environments matter, and their interaction matters.",
    [["What is heritability?","A population statistic describing the proportion of variation associated with genetic differences under specified conditions."],["What is gene–environment interaction?","When the effect of one factor depends on the level of another."],["Does genetic influence mean fixed destiny?","No; development remains responsive to environments and experience."]],
    "Gene–environment interaction",["The effect of one factor depends on another","Genes completely determine behaviour","Environment has no biological influence","All traits are learned"],0,
    "Modern developmental thinking emphasizes interaction between biological and environmental processes."
  ),
  topicPack(
    "Psychological Assessment",2,"Measurement","measurement-and-scales",
    "Measurement and Scales",
    "The foundations of turning psychological constructs into observable scores.",
    "Distinguish nominal, ordinal, interval and ratio scales and explain why operationalization matters.",
    "Measurement links an abstract construct to observable indicators according to explicit rules.",
    "Nominal scales classify categories without a quantitative ordering. Ordinal scales have ordered categories but unequal spacing cannot be assumed. Interval scales have equal intervals but no true zero; ratio scales add a meaningful zero. The mathematical operations justified by a score depend on the scale and the measurement model.\n\nPsychological constructs such as anxiety, intelligence or motivation are not directly visible in the same way as height. Operationalization specifies what indicators will represent the construct. Multiple measures may capture different facets of a construct, and no score should be treated as the construct itself.",
    ["Construct","Operationalization","Nominal","Ordinal","Interval","Ratio"],
    ["Blood groups are nominal categories.","Rank order in a competition is ordinal."],
    ["Anne Anastasi"],"Be ready to define the four scale types with an example.",
    "Do not assume every numerical-looking psychological score is ratio-level measurement.",
    "Measurement turns constructs into scores using explicit rules.",
    [["What is a construct?","An abstract concept such as anxiety, intelligence or motivation that researchers want to study."],["What does ordinal mean?","Scores have an order, but equal differences cannot automatically be assumed."],["What is operationalization?","Specifying how a construct will be measured or manipulated."]],
    "Ordinal",["Ordered categories without guaranteed equal intervals","Categories with no order","Equal intervals with a true zero","Only physical measurements"],0,
    "Ordinal data are ordered, but the distances between ranks are not assumed equal."
  ),
  topicPack(
    "Psychological Assessment",2,"Measurement","reliability",
    "Reliability",
    "Reliability concerns the consistency and precision of measurement.",
    "Explain test–retest, internal consistency and inter-rater reliability and why reliability places an upper limit on useful interpretation.",
    "A reliable measure produces reasonably consistent scores under conditions where the construct should remain stable.",
    "Test–retest reliability examines score stability across time when stability is expected. Internal consistency examines how consistently items relate within a scale. Inter-rater reliability matters when human observers or judges score behaviour. Reliability does not prove validity: a measure can be very consistent while consistently measuring the wrong thing.\n\nSources of error include transient conditions, item sampling and scoring differences. Reliable measurement reduces noise, making valid interpretation more possible, but the appropriate reliability estimate depends on the design and intended use.",
    ["Reliability","Test–retest","Internal consistency","Inter-rater","Measurement error"],
    ["Two trained observers agree on a behaviour code: inter-rater reliability.","A stable trait measure gives similar scores on repeated administrations: test–retest."],
    ["David Wechsler","Anne Anastasi"],"Define at least three reliability approaches and contrast reliability with validity.",
    "Reliability is not the same as validity.",
    "Reliability = consistency; validity = support for interpretation/use.",
    [["What is test–retest reliability?","Consistency of scores across repeated administrations when stability is expected."],["What is inter-rater reliability?","Consistency among observers or judges."],["Can a reliable test be invalid?","Yes; consistency alone does not establish that the intended construct is being measured."]],
    "Consistency",["Consistency of measurement","A diagnosis","A percentile rank","A treatment"],0,
    "Reliability fundamentally concerns consistency or precision of measurement."
  ),
  topicPack(
    "Psychological Assessment",3,"Validity","validity-and-interpretation",
    "Validity and Score Interpretation",
    "Validity concerns the evidence supporting how scores are interpreted and used.",
    "Distinguish content, criterion-related and construct evidence and explain why validity is not a property of a test in isolation.",
    "Validity is about whether evidence supports the interpretation or use you want to make from scores.",
    "Content evidence asks whether the measure adequately represents the construct domain. Criterion-related evidence examines relationships with relevant external criteria. Construct-related evidence considers relationships predicted by theory and research. Modern validity thinking integrates multiple sources of evidence rather than treating validity as a single certificate stamped on a test forever.\n\nA score must be interpreted relative to purpose, population, administration and norms. The same measure can be suitable for one use and inappropriate for another.",
    ["Validity","Content","Criterion","Construct","Interpretation","Norms"],
    ["A reading test should sample the skills it claims to assess.","A new measure of depression should show theoretically expected relationships with related and distinct constructs."],
    ["David Wechsler","Lee Cronbach"],"Explain validity as evidence for an intended interpretation/use, not as 'the test is valid, period'.",
    "A high score alone does not establish a diagnosis or cause.",
    "Validity is about defensible interpretations and uses supported by evidence.",
    [["What is content evidence?","Evidence that test content represents the relevant domain."],["What is criterion-related evidence?","Evidence relating scores to a relevant external criterion."],["Why is context important for validity?","Interpretations depend on the purpose, population and conditions of use."]],
    "Intended interpretation",["The interpretation/use supported by evidence","The test's paper quality","Only the number of items","The user's opinion"],0,
    "Validity concerns the defensibility of an intended score interpretation or use."
  ),
  topicPack(
    "Psychological Assessment",4,"Ethics","ethics-in-assessment",
    "Ethics in Psychological Assessment",
    "Assessment requires professional judgment, confidentiality and respect for persons.",
    "Identify ethical concerns involving informed consent, confidentiality, competence, test security and responsible feedback.",
    "Ethical assessment protects the person being assessed while ensuring that methods are appropriate for the question and the practitioner's competence.",
    "Ethical assessment involves explaining relevant procedures, protecting confidential information, using instruments only within appropriate competence and interpreting results cautiously. Test materials may require security because uncontrolled public exposure can compromise future use. Feedback should be understandable and should not overstate what a score can establish.\n\nCultural and contextual factors matter. Language, education, disability, socioeconomic context and familiarity with testing can influence performance. Ethical practice is not simply obeying a checklist; it requires thoughtful judgment, documentation and professional responsibility.",
    ["Informed consent","Confidentiality","Competence","Test security","Feedback","Culture"],
    ["A psychologist explains the purpose and limits of assessment before beginning.","A report explains uncertainty rather than presenting one score as an unquestionable label."],
    ["None"],"Know consent, confidentiality, competence and responsible interpretation.",
    "Confidentiality is not absolute; legal and safety exceptions can exist, but these must be handled professionally.",
    "Ethical assessment combines informed consent, competent methods, privacy and cautious interpretation.",
    [["Why is informed consent important?","It supports an informed person's voluntary participation and understanding of the assessment."],["Why protect test materials?","Exposure can compromise future validity and security of standardized instruments."],["Why consider culture?","Language and cultural context can affect how scores should be interpreted."]],
    "Competent and responsible practice",["Competent and responsible practice","Sharing scores casually","Ignoring language differences","Using any test for any purpose"],0,
    "Ethics requires competent methods, privacy, informed participation and cautious interpretation."
  ),
  topicPack(
    "Indian Wisdom for Nation Building",2,"Philosophical Traditions","plurality-of-indian-traditions",
    "Plurality of Indian Knowledge Traditions",
    "Indian intellectual history contains multiple schools, texts and practices rather than one uniform doctrine.",
    "Describe the diversity of Indian knowledge traditions and use historical context when comparing ideas.",
    "An academic approach begins by recognizing plurality: philosophical, scientific, artistic, linguistic and ethical traditions developed across different places and periods.",
    "Indian knowledge traditions include multiple philosophical schools and bodies of work in mathematics, astronomy, medicine, linguistics, literature, aesthetics and ethics. They cannot be reduced to a single 'Indian psychology'. Different traditions make different assumptions about mind, self, suffering, knowledge and liberation.\n\nFor psychology students, comparisons can be useful when they are explicit about concepts and historical limits. A modern construct such as attention may overlap with some descriptions of contemplative practice, but overlap does not prove identity. Source criticism and historical context prevent simplistic claims.",
    ["Plurality","Historical context","Philosophy","Ethics","Contemplation","Source criticism"],
    ["Compare concepts of attention while distinguishing modern experimental constructs from historical philosophical aims."],
    ["None"],"Avoid presenting diverse traditions as one homogeneous theory.",
    "Similarity between concepts does not prove that they are identical or historically derived from one another.",
    "Diversity first; compare carefully; separate history from modern interpretation.",
    [["Why use 'traditions' plural?","Because Indian intellectual history contains diverse schools and disciplines."],["What is source criticism?","Evaluating what a source actually claims, its context and its evidential limits."],["Why preserve historical context?","Concepts can have different purposes and meanings in different periods."]],
    "Diverse traditions",["Diverse traditions","One uniform doctrine","One scientific theory","One psychological test"],0,
    "Plurality is the more accurate description of Indian intellectual traditions."
  ),
  topicPack(
    "Indian Wisdom for Nation Building",3,"Values and Citizenship","ethics-and-social-responsibility",
    "Ethics, Responsibility and Social Life",
    "Ethical reasoning concerns how actions and institutions should treat persons and communities.",
    "Distinguish values from empirical claims and connect ethical reasoning to responsible citizenship.",
    "Values guide judgments about what ought to be protected, promoted or avoided; empirical evidence helps us understand consequences and conditions.",
    "Ethical reasoning can involve duties, consequences, virtues, rights and responsibilities. Psychology contributes evidence about behaviour and social processes, but evidence alone does not decide every value question. For example, data may show that an intervention changes behaviour; ethical analysis is still needed to decide whether the means and consequences are acceptable.\n\nFor nation-building and civic life, responsibility includes considering the effects of actions on others, respecting pluralism and recognizing power differences. Psychological students should be alert to stigma, stereotyping and the social consequences of labels.",
    ["Ethics","Values","Responsibility","Pluralism","Stigma","Citizenship"],
    ["A policy can be evaluated for outcomes and also for fairness, dignity and rights."],
    ["None"],"Separate descriptive evidence from normative judgments and recognize plural ethical perspectives.",
    "Do not claim that a study result automatically tells us what society ought to do.",
    "Evidence describes effects; ethics evaluates what should be valued and done.",
    [["What is a value?","A principle or standard about what is considered desirable, important or worthy."],["Why distinguish facts and values?","Empirical findings describe what happens; values help judge what ought to happen."],["Why does psychology care about stigma?","Labels and stereotypes can affect behaviour, opportunity and well-being."]],
    "Values and evidence play different roles",["Values and evidence play different roles","Facts automatically decide ethics","Ethics is just opinion","Evidence has no role in decisions"],0,
    "Empirical evidence and ethical reasoning inform decisions in different but complementary ways."
  ),
  topicPack(
    "Wellness, Yoga and Sports for Sustainable Living",1,"Foundations of Wellness","dimensions-of-wellbeing",
    "Dimensions of Well-Being",
    "Well-being is multidimensional and includes interacting physical, psychological and social aspects of life.",
    "Identify dimensions of well-being and explain why a single symptom or metric is not the whole picture.",
    "Wellness is broader than the absence of disease and can involve habits, relationships, meaning, functioning and recovery.",
    "Well-being is often discussed through physical, psychological, emotional, social and sometimes spiritual or purpose-related dimensions. These dimensions interact: sleep can affect mood and attention; social isolation can affect motivation; physical activity can influence stress regulation. There is no single universal score that captures every relevant aspect of human flourishing.\n\nA sustainable approach also recognizes constraints. Advice should consider access, disability, culture, workload and socioeconomic conditions rather than treating wellness as a matter of individual willpower alone.",
    ["Well-being","Lifestyle","Recovery","Social connection","Functioning","Sustainability"],
    ["A student improving sleep, social support and study routines may experience changes across several dimensions."],
    ["None"],"Define well-being broadly and avoid reducing it to fitness or happiness alone.",
    "Wellness advice should not ignore structural or individual constraints.",
    "Well-being is multidimensional and contextual.",
    [["Is wellness only physical health?","No. It can include psychological, social and functional dimensions."],["Why is context important?","Resources, culture, disability and workload can shape what sustainable wellness looks like."],["Why think in dimensions?","Different aspects of well-being interact and may not move together."]],
    "Multidimensional",["Multidimensional","Only physical","Only emotional","Only financial"],0,
    "Well-being is broader than any single dimension."
  ),
  topicPack(
    "Wellness, Yoga and Sports for Sustainable Living",2,"Yoga and Mind–Body Practice","yoga-and-mindfulness",
    "Yoga and Mind–Body Practice",
    "Yoga includes physical, breathing and contemplative practices with diverse historical and modern forms.",
    "Describe yoga as a diverse tradition and distinguish physical practice from broader philosophical traditions.",
    "Yoga is not one single exercise routine; traditions and modern teaching contexts vary considerably.",
    "Yoga has historical roots in Indian philosophical and contemplative traditions and is practiced today in many forms. Some modern classes emphasize postures and breathing; other traditions place greater weight on meditation, ethics or philosophy. Psychological research can investigate effects of specific practices, but evidence about one protocol should not automatically be generalized to every form of yoga.\n\nMindfulness similarly refers to ways of cultivating present-moment awareness and a particular attitude toward experience. Students should distinguish a research-defined intervention from broad cultural claims about ancient practices.",
    ["Yoga","Asana","Pranayama","Mindfulness","Contemplation","Context"],
    ["A study might examine a specific eight-week yoga protocol rather than 'yoga' in all forms."],
    ["None"],"Use careful language: specify the practice, population and outcome when discussing evidence.",
    "Do not claim all yoga practices have identical effects.",
    "Yoga is diverse; research findings depend on the practice and context studied.",
    [["Why specify a yoga protocol in research?","Different forms and doses of practice can differ substantially."],["What is mindfulness broadly?","Intentional attention to present experience with a particular attitude, often described in contemporary interventions."],["Does every yoga practice equal exercise?","No. Yoga traditions can include physical, breathing, contemplative and ethical elements."]],
    "Specific practice and context",["Specific practice and context","All yoga is identical","Yoga has one fixed method","Research is unnecessary"],0,
    "Scientific claims should identify the actual practice and context being studied."
  ),
  topicPack(
    "Wellness, Yoga and Sports for Sustainable Living",3,"Physical Activity","exercise-and-mental-health",
    "Exercise and Mental Health",
    "Physical activity can interact with mood, cognition, sleep and stress regulation.",
    "Explain plausible psychological pathways and avoid overclaiming causal effects.",
    "Regular physical activity is associated with several health outcomes, but responses depend on intensity, frequency, individual differences and context.",
    "Physical activity can affect energy, sleep, mood and stress through behavioural, physiological and social pathways. Exercise programs may create routine, mastery experiences, social connection and changes in physiological arousal. Research findings are strongest when they specify the activity, comparison condition and outcome.\n\nExercise is not a universal substitute for professional treatment. Some people face medical, disability, time or access constraints, so recommendations should be individualized and sustainable.",
    ["Physical activity","Mood","Sleep","Stress","Adherence","Recovery"],
    ["A walking routine may be easier to sustain than an extreme exercise plan for a busy student.","Team sport can combine physical activity with social connection."],
    ["None"],"Explain mechanisms and distinguish association from causation.",
    "Avoid 'exercise cures depression/anxiety' style claims.",
    "Movement can support health, but dose, context and individual needs matter.",
    [["Why does adherence matter?","A program cannot help consistently if it is not sustainable or followed."],["Can exercise influence sleep?","Physical activity can interact with sleep patterns, though effects vary by person and timing."],["Why avoid cure claims?","Mental health conditions are complex and require context-appropriate evidence and care."]],
    "Context and adherence",["Context and adherence","One perfect exercise for everyone","Exercise always cures disorders","Intensity never matters"],0,
    "Responsible wellness claims specify context, dose, adherence and outcomes."
  ),
  topicPack(
    "Wellness, Yoga and Sports for Sustainable Living",4,"Sports Psychology","motivation-and-performance",
    "Motivation and Sports Performance",
    "Motivation influences effort, persistence and how athletes interpret performance challenges.",
    "Differentiate intrinsic and extrinsic motivation and discuss goals, feedback and self-regulation.",
    "Performance is shaped by motivation, attention, practice quality, confidence and the situation in which performance occurs.",
    "Intrinsic motivation involves engagement because the activity is satisfying or interesting; extrinsic motivation involves separable outcomes such as rewards or recognition. Goal setting can improve direction and persistence when goals are specific and appropriately challenging. Feedback is most useful when it is informative and supports learning rather than merely judging a person.\n\nSelf-regulation includes planning, monitoring performance and adjusting behaviour. In sport and study alike, motivation is dynamic rather than a fixed personality trait.",
    ["Intrinsic motivation","Extrinsic motivation","Goal setting","Feedback","Self-regulation"],
    ["A runner practices technique because improvement itself is satisfying.","A student uses a specific process goal such as completing three retrieval sessions."],
    ["None"],"Know intrinsic vs extrinsic motivation and the role of specific goals and feedback.",
    "More pressure does not automatically produce better performance.",
    "Good performance systems combine motivation, practice, goals, feedback and self-regulation.",
    [["What is intrinsic motivation?","Engagement because the activity itself is interesting or satisfying."],["Why make goals specific?","Specific goals direct attention and make progress easier to monitor."],["What is self-regulation?","Planning, monitoring and adjusting one's behaviour toward a goal."]],
    "Intrinsic motivation",["Engagement for interest or satisfaction","Only external rewards","Avoiding all goals","Random practice"],0,
    "Intrinsic motivation concerns reasons inherent in the activity rather than separable rewards."
  ),
  topicPack(
    "Practicum::I",1,"Professional Foundations","observation-skills",
    "Foundations of Psychological Observation",
    "Practicum observation is systematic recording, not casual watching.",
    "Practice defining target behaviours, distinguishing observation from inference, and documenting context.",
    "Good observation records what was seen or heard before interpreting what it might mean.",
    "A behavioural observation begins with a target behaviour defined clearly enough that different observers could recognize it. Record antecedent/context, observable behaviour and consequences when appropriate. Separate notes such as 'looked at the floor for 8 seconds' from interpretations such as 'felt ashamed'. The latter may be a hypothesis, not a direct observation.\n\nGood observation also requires respect for privacy, careful documentation and attention to observer bias. Repeated practice and supervision improve consistency.",
    ["Target behaviour","Operational definition","Antecedent","Consequence","Observer bias"],
    ["Observation: 'client paused for 5 seconds before answering.' Inference: 'client was anxious.'"],
    ["None"],"Differentiate observation from inference and define target behaviour operationally.",
    "Do not present interpretations as directly observed facts.",
    "Observe first; interpret cautiously; document context.",
    [["What is a target behaviour?","A specific behaviour selected for systematic observation."],["Why separate observation and inference?","Because interpretation goes beyond what can be directly observed."],["What is observer bias?","Systematic influence of expectations on what or how an observer records behaviour."]],
    "Observable behaviour",["Observable behaviour","A hidden motive stated as fact","A diagnosis","A personality trait"],0,
    "Observation should prioritize behaviours that can be directly and reliably recorded."
  ),
  topicPack(
    "Practicum::I",2,"Interview Skills","basic-interviewing",
    "Basic Psychological Interviewing",
    "A psychological interview gathers information through purposeful, respectful conversation.",
    "Distinguish open and closed questions and describe rapport, listening and neutrality.",
    "An interview is not an interrogation; the quality of information depends partly on rapport, clarity and the interviewer's behaviour.",
    "Open questions invite elaboration; closed questions can clarify specific facts. Effective interviewing includes attentive listening, appropriate reflection, clarification and summarization. Rapport does not mean agreeing with every claim. It means creating enough psychological safety for communication while maintaining professional boundaries.\n\nLeading questions can distort responses. Interviewers should monitor their assumptions and use neutral language. In clinical contexts, interviews also have ethical and confidentiality considerations.",
    ["Open question","Closed question","Rapport","Reflection","Leading question"],
    ["Open: 'What has been difficult lately?' Closed: 'When did this start?'"],
    ["None"],"Know open vs closed questions, rapport and leading questions.",
    "Avoid asking loaded questions that suggest the answer.",
    "Good interviewing is structured, listening-based and professionally bounded.",
    [["What is an open question?","A question that invites a broader response rather than a yes/no answer."],["What is rapport?","A professional working relationship that supports communication and cooperation."],["Why avoid leading questions?","They can bias the respondent toward the answer implied by the interviewer."]],
    "Open question",["A question inviting elaboration","A forced-choice item","A diagnosis","A scoring rule"],0,
    "Open questions typically invite fuller descriptions and exploration."
  ),
  topicPack(
    "Practicum::I",3,"Professional Documentation","case-notes-and-reflection",
    "Case Notes and Reflective Practice",
    "Professional records should be factual, organized and useful for continuity of care or learning.",
    "Distinguish factual documentation from reflection and use clear professional language.",
    "Documentation records relevant information; reflection examines the practitioner's own reactions, assumptions and learning.",
    "Good case notes use dates, clear headings, relevant observations and professional language. Avoid unnecessary identifying details and avoid stigmatizing descriptions. Reflective notes can examine what the student noticed, what assumptions may have influenced them and what they would do differently next time.\n\nDocumentation is part of professional accountability. It should be accurate enough that another authorized professional or supervisor can understand what occurred and why a decision was made.",
    ["Documentation","Reflection","Confidentiality","Objectivity","Supervision"],
    ["A case note records observed behaviour; a reflective note considers the student's response and possible bias."],
    ["None"],"Separate factual records from reflective learning and protect confidentiality.",
    "Do not write casual or judgmental language in professional records.",
    "Record relevant facts clearly; reflect separately; protect privacy.",
    [["What is reflective practice?","Systematic examination of one's own reactions, assumptions and professional learning."],["Why is documentation important?","It supports continuity, accountability and clear professional communication."],["Why avoid judgmental labels?","They can distort records and harm the person being described."]],
    "Professional documentation",["Accurate and relevant recording","Casual storytelling","Public posting","Unverified diagnosis"],0,
    "Professional notes should be accurate, relevant, respectful and appropriately confidential."
  ),
  topicPack(
    "Fundamentals of Economics",1,"Microeconomics Basics","scarcity-and-choice",
    "Scarcity, Choice and Opportunity Cost",
    "Economic reasoning begins with the fact that resources are limited while wants and goals can exceed them.",
    "Define scarcity, opportunity cost and marginal decision-making.",
    "Scarcity forces choices; the opportunity cost of a choice is the value of the best alternative forgone.",
    "Scarcity exists because time, money, labour and other resources are limited. Opportunity cost makes the trade-off explicit. If a student spends two hours working rather than studying, the opportunity cost is the value of the best forgone study alternative. Marginal analysis compares the additional benefit and additional cost of one more unit of an action.\n\nEconomic reasoning can be useful in psychology when thinking about time, incentives and resource allocation, but psychological decision-making also involves biases and social context.",
    ["Scarcity","Choice","Opportunity cost","Marginal benefit","Marginal cost"],
    ["Choosing a two-hour shift means giving up the value of another two-hour use of that time."],
    ["Adam Smith"],"Define opportunity cost precisely as the best alternative forgone.",
    "It is not every alternative; it is the best forgone alternative.",
    "Limited resources → choices → trade-offs → opportunity costs.",
    [["What is scarcity?","The condition of limited resources relative to wants or uses."],["What is opportunity cost?","The value of the best alternative forgone."],["What is marginal analysis?","Comparing additional benefits with additional costs of a change."]],
    "Opportunity cost",["Value of the best alternative forgone","Total money spent","Any possible alternative","A sunk cost"],0,
    "Opportunity cost focuses on the best alternative that is given up."
  ),
  topicPack(
    "Fundamentals of Economics",2,"Demand and Supply","demand-supply",
    "Demand and Supply",
    "Demand and supply models describe how buyers and sellers can interact in markets.",
    "Explain the law of demand, law of supply and equilibrium at a basic level.",
    "A market equilibrium is where the quantity buyers plan to purchase equals the quantity sellers plan to offer, given the model's assumptions.",
    "Demand describes quantities consumers are willing and able to buy at different prices, holding other relevant factors constant. Supply describes quantities producers are willing and able to sell. A change in price moves along a curve; a change in other determinants can shift the curve.\n\nEquilibrium is a model concept, not a claim that every real market is perfectly competitive or instantaneously clears. Real economies include information problems, market power, externalities and institutions.",
    ["Demand","Supply","Equilibrium","Price","Quantity demanded","Quantity supplied"],
    ["A change in consumer income can shift demand for a normal good.","A technology improvement can shift supply."],
    ["Alfred Marshall"],"Distinguish movement along a curve from a shift in the curve.",
    "Do not say any price change 'shifts demand'—price changes move along the demand curve in the standard model.",
    "Price changes move along curves; non-price determinants shift them.",
    [["What is demand?","The quantity consumers are willing and able to buy at different prices, ceteris paribus."],["What is equilibrium?","A point where quantity demanded equals quantity supplied in the model."],["What can shift supply?","Factors such as technology, input costs or expectations."]],
    "Equilibrium",["Quantity demanded equals quantity supplied","Demand is zero","Supply is infinite","Price is always zero"],0,
    "Equilibrium is the model point where planned quantity demanded and supplied coincide."
  ),
  topicPack(
    "Fundamentals of Economics",3,"Macroeconomics","inflation-and-unemployment",
    "Inflation and Unemployment",
    "Macroeconomic indicators summarize broad changes in prices and labour-market conditions.",
    "Define inflation, unemployment and distinguish levels from rates.",
    "Inflation is a sustained rise in the general price level; unemployment refers to people without work who are available and actively seeking work under the statistical definition used.",
    "Inflation concerns changes in the general price level rather than one product becoming more expensive. Unemployment rates depend on labour-force definitions. The relationship between inflation and unemployment is not a simple permanent trade-off; expectations, supply shocks and monetary conditions matter. Psychology can enter through expectations, household stress, job insecurity and decision-making under uncertainty.\n\nStudents should distinguish nominal and real quantities when prices change because the purchasing power of money can move even when the nominal amount is unchanged.",
    ["Inflation","Unemployment","Labour force","Nominal","Real","Purchasing power"],
    ["A 5% rise in one item's price is not by itself economy-wide inflation.","A worker who has stopped looking for work may be classified differently than an actively searching unemployed person."],
    ["John Maynard Keynes"],"Define inflation and unemployment precisely and avoid using them interchangeably with price or job changes.",
    "Inflation is not the same as one price increase.",
    "Inflation = general price-level change; unemployment = labour-market status.",
    [["What is inflation?","A sustained increase in the general price level."],["What is purchasing power?","The quantity of goods and services a unit of money can buy."],["Why distinguish nominal and real values?","Real values adjust for price changes and better reflect purchasing power."]],
    "General price level",["General price level","One product only","One person's wage","One firm's cost"],0,
    "Inflation refers to a broad change in the general price level."
  ),
  topicPack(
    "Elementary French: Communication and Culture for Beginners",1,"Foundations","french-greetings-and-introductions",
    "French Greetings and Introductions",
    "Core phrases for greeting, introducing yourself and using basic polite forms.",
    "Use common greetings, introduce yourself and recognize tu/vous at a beginner level.",
    "Bonjour and bonsoir are common greetings; 'Comment ça va ?' asks how someone is doing.",
    "Beginner communication should prioritize pronunciation, politeness and context. Bonjour is widely used during the day; bonsoir is used in the evening. 'Je m'appelle...' introduces a name. 'Je suis...' can identify oneself in simple contexts. 'Vous' is used as a formal or plural form; 'tu' is informal singular. Language learning benefits from retrieval, listening and short repeated practice rather than memorizing isolated word lists.",
    ["Bonjour","Bonsoir","Je m'appelle","Comment ça va ?","Tu","Vous"],
    ["Bonjour, je m'appelle Harshit.","Comment ça va ? — Ça va bien."],
    ["None"],"Practice exact spelling, accents and when formal/informal forms are appropriate.",
    "Do not pronounce French solely by English spelling rules.",
    "Start with short, polite phrases and use them in context.",
    [["How do you say 'hello' in French?","Bonjour."],["How do you introduce your name?","Je m'appelle..."],["What is the basic difference between tu and vous?","Tu is informal singular; vous is formal singular or plural."]],
    "Bonjour",["Hello","Good night","Thank you","Please"],0,
    "Bonjour is the common daytime greeting."
  ),
  topicPack(
    "Elementary French: Communication and Culture for Beginners",2,"Core Grammar","french-pronouns-and-etre",
    "French Pronouns and Être",
    "A beginner structure for subject pronouns and the verb être.",
    "Recognize common subject pronouns and use basic forms of être in simple sentences.",
    "Je, tu, il/elle, nous, vous and ils/elles are core subject pronouns; être means 'to be'.",
    "Basic forms of être include je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. Students should learn the form together with a short sentence rather than memorizing an abstract table only. Pronunciation and contractions in actual speech may differ from what a beginner expects.\n\nFrench nouns and adjectives also involve grammatical gender and agreement, which should be introduced gradually.",
    ["Je","Tu","Il/elle","Nous","Vous","Être"],
    ["Je suis étudiant(e).","Nous sommes étudiants."],
    ["None"],"Memorize the six core subject-pronoun forms and the basic conjugation of être.",
    "Do not mix the subject pronoun with the English word order automatically.",
    "Learn être as a complete mini-paradigm: suis, es, est, sommes, êtes, sont.",
    [["What does être mean?","To be."],["How do you say 'I am' with être?","Je suis."],["How do you say 'you are' formally or plural?","Vous êtes."]],
    "Je suis",["I am","You are","We are","They are"],0,
    "Je suis means 'I am'."
  ),
  topicPack(
    "Elementary German: Communication and Culture for Beginners",1,"Foundations","german-greetings-and-introductions",
    "German Greetings and Introductions",
    "Core phrases for greeting and introducing yourself in beginner German.",
    "Use Hallo, Guten Morgen, Guten Tag and simple self-introduction phrases.",
    "Beginner German emphasizes clear greetings, sentence capitalization and polite context.",
    "Hallo is an informal greeting. Guten Morgen means good morning and Guten Tag is a common formal daytime greeting. 'Ich heiße...' is a common way to say 'my name is...'. 'Wie geht es Ihnen?' is a formal way to ask how someone is doing, while 'Wie geht's?' is informal. Pronunciation should be learned from audio when possible.\n\nGerman nouns are capitalized in writing, which is an important beginner convention.",
    ["Hallo","Guten Morgen","Guten Tag","Ich heiße","Wie geht's","Ihnen"],
    ["Guten Tag, ich heiße Harshit.","Wie geht's? — Gut, danke."],
    ["None"],"Know common greetings and distinguish informal from formal forms.",
    "Do not assume German pronunciation follows English spelling conventions.",
    "Greeting phrases are learned best as complete expressions.",
    [["How do you say 'hello'?","Hallo."],["How do you introduce your name?","Ich heiße..."],["What does Guten Tag mean?","Good day / hello in a formal daytime context."]],
    "Guten Tag",["Good day / hello","Good night","Thank you","Please"],0,
    "Guten Tag is a common daytime greeting."
  ),
  topicPack(
    "Elementary German: Communication and Culture for Beginners",2,"Core Grammar","german-pronouns-and-sein",
    "German Pronouns and Sein",
    "A beginner structure for subject pronouns and the verb sein.",
    "Recognize common German subject pronouns and use basic forms of sein.",
    "Sein means 'to be'; core forms include ich bin, du bist, er/sie ist, wir sind, ihr seid and sie/Sie sind.",
    "German subject pronouns include ich, du, er, sie, es, wir, ihr and sie/Sie. The verb sein is irregular and is therefore best learned as a complete set of forms. Word order in simple statements is often more predictable than in longer sentences, but German uses cases and flexible word order for different functions.\n\nBeginner learners should focus on accurate high-frequency sentences before attempting complex grammar.",
    ["Ich","Du","Sie","Wir","Sein","Bin"],
    ["Ich bin Student.","Wir sind Studenten."],
    ["None"],"Learn the basic sein forms and distinguish du from Sie.",
    "Do not confuse the capitalized formal Sie with the lower-case plural sie.",
    "Sein is irregular: bin, bist, ist, sind, seid, sind.",
    [["What does sein mean?","To be."],["How do you say 'I am'?","Ich bin."],["How do you say 'you are' informally singular?","Du bist."]],
    "Ich bin",["I am","You are","We are","They are"],0,
    "Ich bin means 'I am'."
  )
);

// Add several rich concept branches to the three original starter topics too.
function enrichMindMap(t:any) {
  const keys = Array.isArray(t.keyTerms) ? t.keyTerms : [];
  const extras = [
    { id:"b5", label:keys[4]||"Application", parent:"root", detail:t.examples?.[0]||"", level:1 },
    { id:"s6", label:"Why it matters", parent:"b5", detail:t.examFocus||"", level:2 },
    { id:"s7", label:"Trap", parent:"b5", detail:t.commonMistakes||"", level:2 }
  ];
  const current = Array.isArray(t.mindMap) ? t.mindMap : [];
  return [...current.filter((n:any)=>!["b5","s6","s7"].includes(n.id)), ...extras];
}

const OFFICIAL_SEMESTERS: Record<number, string[]> = {
  1: [
    "Fundamental of Psychology",
    "Biological Basis of Behavior",
    "Introduction to Abnormal Psychology",
    "MDC Pool/MOOCs",
    "Introduction to French Culture & Language / Introduction to German Culture & Language",
    "Punjabi Language and Literature - 1 / History and Culture of Punjab for BA",
    "Psychological Assessment",
    "Environmental Studies- I",
    "Understanding Self for Effectiveness"
  ],
  2: [
    "Psychology of personality and Behaviour",
    "Health Psychology",
    "Introduction to Child and Mental Health & Disorders",
    "MDC Pool/MOOCs",
    "French Grammar / German Grammar",
    "Punjabi / History and Culture of Punjab",
    "Personal Growth and Development",
    "Environmental Studies- II",
    "Individual, Society and Nation"
  ],
  3: [
    "Research Methodology and Statistics-I",
    "Developmental Psychology",
    "Practicum-1",
    "MDC Pool/MOOCs",
    "Emotional Intelligence"
  ],
  4: [
    "Psychotherapy-I",
    "Cognitive Psychology",
    "Introduction to Clinical Psychology",
    "Practicum- II",
    "Research Methods and Statistics - II",
    "Stress Management"
  ],
  5: [
    "Forensic Psychology",
    "Foundations of Social Psychology",
    "Psychotherapy - II",
    "Research Methods and Statistics - II",
    "Fundamentals of Communication",
    "Workplace Psychology",
    "Summer Internship"
  ],
  6: [
    "Positive Psychology",
    "Introduction to Neuropsychology",
    "Experimental Psychology",
    "Indian Psychology",
    "Practicum IV",
    "Environmental Psychology"
  ]
};

const BLUEPRINTS: Record<string, {unit: string; topics: string[]; focus: string}> = {
  "Fundamental of Psychology": { unit:"Foundations and Core Processes", topics:["Meaning and Goals of Psychology","History and Schools of Psychology","Sensation and Perception","Learning and Conditioning","Memory and Forgetting","Motivation and Emotion"], focus:"Build the basic vocabulary and major approaches before moving into applied areas." },
  "Biological Basis of Behavior": { unit:"Neural Foundations", topics:["Neurons and Glial Cells","Synapses and Neurotransmitters","Brain and Nervous System","Action Potential","Endocrine System and Behaviour","Genes and Environment"], focus:"Connect biological mechanisms to behaviour without reducing complex behaviour to one brain area or chemical." },
  "Introduction to Abnormal Psychology": { unit:"Understanding Psychological Dysfunction", topics:["Meaning and Models of Abnormality","Classification and Diagnosis","Anxiety-Related Conditions","Mood Disorders","Psychotic Disorders","Ethical and Cultural Issues"], focus:"Learn concepts and diagnostic reasoning cautiously; a symptom alone is not a diagnosis." },
  "Psychology of personality and Behaviour": { unit:"Personality Foundations", topics:["What Is Personality?","Psychodynamic Approaches","Trait Approaches","Social-Cognitive Approaches","Person-Situation Debate","Personality Assessment"], focus:"Compare theories rather than memorizing isolated names." },
  "Health Psychology": { unit:"Health Behaviour and Illness", topics:["Introduction to Health Psychology","Stress and Health","Health Behaviours","Pain and Coping","Illness Beliefs","Adherence and Communication"], focus:"Understand the interaction of biological, psychological and social factors in health." },
  "Introduction to Child and Mental Health & Disorders": { unit:"Child Mental Health", topics:["Normal and Atypical Development","Childhood Anxiety","Neurodevelopmental Conditions","Child Behaviour Problems","Family and School Context","Assessment and Early Intervention"], focus:"Think developmentally and contextually rather than applying adult assumptions to children." },
  "Research Methodology and Statistics-I": { unit:"Research Foundations", topics:["Scientific Method","Variables and Operationalization","Sampling","Research Designs","Descriptive Statistics","Correlation and Interpretation"], focus:"Match method to question and avoid causal claims from correlational evidence." },
  "Developmental Psychology": { unit:"Human Development", topics:["Principles of Development","Attachment","Cognitive Development","Social and Emotional Development","Adolescence","Adulthood and Ageing"], focus:"Track development as an interaction of biological, cognitive, emotional and social processes." },
  "Psychotherapy-I": { unit:"Psychotherapy Foundations", topics:["What Is Psychotherapy?","Therapeutic Relationship","Behavioural Approaches","Cognitive Approaches","Humanistic Approaches","Outcome and Evidence"], focus:"Compare therapeutic assumptions and techniques; avoid promising that one approach works for everyone." },
  "Cognitive Psychology": { unit:"Cognitive Processes", topics:["Attention","Perception","Working Memory","Long-Term Memory","Problem Solving","Language and Thinking"], focus:"Study information-processing models and recognize the limits of simplistic 'memory storage' metaphors." },
  "Introduction to Clinical Psychology": { unit:"Clinical Practice Foundations", topics:["Scope of Clinical Psychology","Clinical Interview","Case Formulation","Assessment and Diagnosis","Intervention Planning","Professional Ethics"], focus:"Distinguish assessment, diagnosis, formulation and intervention." },
  "Research Methods and Statistics - II": { unit:"Advanced Research Reasoning", topics:["Experimental Design","Inferential Statistics","Hypothesis Testing","Effect Size and Confidence Intervals","Quasi-Experimental Designs","Research Reporting"], focus:"Interpret statistical results with effect size, uncertainty and design limitations." },
  "Stress Management": { unit:"Stress and Coping", topics:["What Is Stress?","Stress Appraisal","Coping Strategies","Physiological Stress Response","Resilience","Stress Management Planning"], focus:"Think in terms of appraisal, context, coping resources and sustainable behaviour change." },
  "Forensic Psychology": { unit:"Psychology and Law", topics:["Scope of Forensic Psychology","Eyewitness Memory","Criminal Behaviour","Risk Assessment","Psychology in Court","Ethical Limits"], focus:"Separate scientific psychological evidence from popular forensic stereotypes." },
  "Foundations of Social Psychology": { unit:"People in Social Context", topics:["Social Cognition","Attribution","Attitudes","Conformity and Obedience","Groups","Prejudice and Stereotyping"], focus:"Understand how social contexts shape judgement, behaviour and identity." },
  "Psychotherapy - II": { unit:"Advanced Therapeutic Approaches", topics:["Integrative Approaches","Trauma-Focused Work","Family and Systemic Approaches","Group Therapy","Relapse Prevention","Therapy Evaluation"], focus:"Compare indications, mechanisms and limits of different therapeutic approaches." },
  "Fundamentals of Communication": { unit:"Communication Skills", topics:["Communication Models","Active Listening","Nonverbal Communication","Barriers and Miscommunication","Feedback","Professional Communication"], focus:"Practice clarity, listening and feedback instead of treating communication as simply speaking." },
  "Workplace Psychology": { unit:"Work and Organisations", topics:["Work Motivation","Job Satisfaction","Leadership","Teamwork","Occupational Stress","Selection and Training"], focus:"Apply psychology to work systems while considering organisational context." },
  "Positive Psychology": { unit:"Human Strengths and Well-Being", topics:["History and Scope","Positive Emotion","Character Strengths","Meaning and Purpose","Resilience","Well-Being Interventions"], focus:"Study positive functioning without replacing mental-health science with simplistic positivity." },
  "Introduction to Neuropsychology": { unit:"Brain–Behaviour Relationships", topics:["Neuropsychology Overview","Lateralization","Memory Systems","Executive Functions","Language Disorders","Neuropsychological Assessment"], focus:"Connect brain systems with cognitive and behavioural functions using careful evidence." },
  "Experimental Psychology": { unit:"Experimental Inquiry", topics:["Experimental Logic","Control and Randomization","Psychophysical Methods","Learning Experiments","Attention Experiments","Experimental Reporting"], focus:"Understand how experiments isolate variables and where laboratory control can limit generalization." },
  "Indian Psychology": { unit:"Indian Psychological Thought", topics:["Indian Psychology as a Field","Concepts of Self","Attention and Contemplation","Emotion and Suffering","Ethics and Well-Being","Cross-Cultural Comparison"], focus:"Compare traditions with historical humility instead of forcing one-to-one equivalence with modern constructs." },
  "Environmental Psychology": { unit:"People and Environments", topics:["Person–Environment Relations","Crowding","Noise and Stress","Place Attachment","Environmental Behaviour","Sustainable Behaviour"], focus:"Study how physical and social environments interact with cognition, affect and behaviour." },
  "Practicum-1": { unit:"Practical Psychological Skills", topics:["Behavioural Observation","Interview Skills","Case Notes","Ethical Practice","Basic Assessment Practice"], focus:"Move from textbook definitions to supervised observation, interviewing and documentation." },
  "Practicum- II": { unit:"Applied Clinical Skills", topics:["Clinical Interview Practice","Observation and Behaviour Recording","Assessment Administration","Case Formulation Practice","Professional Documentation"], focus:"Practice under supervision and treat observed behaviour, inference and diagnosis as distinct levels of reasoning." },
  "Practicum IV": { unit:"Advanced Practical Skills", topics:["Assessment Interpretation","Case Presentation","Intervention Planning","Professional Communication","Reflective Practice"], focus:"Integrate assessment, formulation, intervention planning and reflection." },
  "MDC Pool/MOOCs": { unit:"Flexible Elective Learning", topics:["Choosing an Elective","Reading a Course Outline","Independent Study Skills","Digital Learning Literacy"], focus:"Treat this as a flexible container; the exact MOOC/elective depends on the university offering." },
  "Introduction to French Culture & Language / Introduction to German Culture & Language": { unit:"Beginner Language and Culture", topics:["Greetings and Introductions","Numbers and Dates","Basic Pronouns","Everyday Vocabulary","Simple Sentences"], focus:"Use retrieval and speaking practice rather than passive memorization." },
  "French Grammar / German Grammar": { unit:"Language Structure", topics:["Articles and Gender","Present Tense","Question Forms","Basic Negation","Short Reading Comprehension"], focus:"Learn grammar in short communicative examples." },
  "Punjabi Language and Literature - 1 / History and Culture of Punjab for BA": { unit:"Language, Literature and Culture", topics:["Punjabi Language Basics","Literary Traditions","Historical Sources","Punjab's Cultural Heritage","Language and Identity"], focus:"Keep language, literature and history grounded in their cultural context." },
  "Punjabi / History and Culture of Punjab": { unit:"Punjabi Language and Culture", topics:["Functional Punjabi","Literary Forms","Punjab History Overview","Cultural Institutions","Identity and Memory"], focus:"Connect communication with regional history and cultural context." },
  "Psychological Assessment": { unit:"Measurement and Assessment", topics:["What Is Psychological Assessment?","Measurement and Scales","Reliability","Validity","Norms and Interpretation","Ethics in Assessment"], focus:"Assessment is broader than a test; interpret scores in context." },
  "Environmental Studies- I": { unit:"Environment and Human Systems", topics:["Ecosystems","Natural Resources","Biodiversity","Pollution","Climate and Human Health"], focus:"Build basic environmental literacy and connect environmental change to human life." },
  "Environmental Studies- II": { unit:"Sustainability and Society", topics:["Sustainable Development","Waste Management","Water and Energy","Environmental Policy","Individual and Collective Action"], focus:"Think beyond individual behaviour to systems and policy." },
  "Understanding Self for Effectiveness": { unit:"Self-Awareness and Effectiveness", topics:["Self-Concept","Self-Efficacy","Values","Goal Setting","Self-Regulation"], focus:"Use reflection with evidence-based concepts rather than vague self-help." },
  "Personal Growth and Development": { unit:"Personal Development", topics:["Self-Awareness","Goal Setting","Habits","Interpersonal Skills","Resilience","Reflective Practice"], focus:"Turn self-reflection into observable goals and behavioural experiments." },
  "Individual, Society and Nation": { unit:"Person in Social Context", topics:["Individual and Society","Identity","Institutions","Citizenship","Pluralism","Social Responsibility"], focus:"Connect psychological processes with broader social structures and civic life." },
  "Emotional Intelligence": { unit:"Emotion and Regulation", topics:["Emotion Recognition","Self-Awareness","Emotion Regulation","Empathy","Social Skills","Applications of Emotional Intelligence"], focus:"Treat emotional intelligence as a set of capacities and models, not a magic trait." },
  "Stress Management": { unit:"Stress and Coping", topics:["What Is Stress?","Stress Appraisal","Coping","Physiological Response","Resilience","Stress Management Plan"], focus:"Study stress through appraisal, resources and coping." },
};


function expandStudyNotes(
  subject: string,
  title: string,
  quickExplanation: string,
  focus: string,
  baseNotes: string
) {
  const t = title.toLowerCase();

  const mechanics: string[] = [];
  if (t.includes("neuron") || t.includes("glial")) {
    mechanics.push(
      "A useful mental model is division of labour: dendrites commonly receive input, the soma helps maintain and integrate cellular activity, the axon carries electrical activity, and terminals communicate with other cells.",
      "Glial cells are not passive filler. Different glial populations help with insulation, metabolic support, immune functions and maintenance of the neural environment."
    );
  } else if (t.includes("synapse") || t.includes("neurotrans")) {
    mechanics.push(
      "At a chemical synapse, electrical activity reaches a presynaptic terminal, signalling molecules are released, they cross the synaptic cleft, and receptors on the receiving cell detect the signal.",
      "The same neurotransmitter can have different effects in different circuits because receptor subtype, location and network context matter. 'One chemical = one behaviour' is a bad study shortcut."
    );
  } else if (t.includes("action potential")) {
    mechanics.push(
      "An action potential is a rapid, all-or-none change in membrane potential that travels along an axon once threshold conditions are reached.",
      "The sequence is more useful than memorising isolated words: resting state → threshold → rapid depolarisation → repolarisation → brief recovery period."
    );
  } else if (t.includes("brain") || t.includes("nervous system")) {
    mechanics.push(
      "Think in systems rather than a single 'brain spot'. The central nervous system includes the brain and spinal cord; the peripheral nervous system connects the central system with the rest of the body.",
      "Brain regions interact in networks. A strong exam answer names a structure only when the evidence supports the function being discussed."
    );
  } else if (t.includes("endocrine")) {
    mechanics.push(
      "The endocrine system communicates using hormones released into the bloodstream. Hormonal effects often develop more slowly than a fast neural signal and can last longer.",
      "The key exam distinction is communication route: neural signalling is often rapid and targeted; endocrine signalling uses hormones and circulation."
    );
  } else if (t.includes("gene") || t.includes("environment") || t.includes("heredit")) {
    mechanics.push(
      "Genes can influence sensitivity, development and behaviour, but behaviour is rarely explained by genes alone. Development reflects interactions among genes, environments and experiences.",
      "Avoid the false choice of 'nature versus nurture'. Modern developmental reasoning is usually about interaction, context and probabilities."
    );
  } else if (t.includes("sensation") || t.includes("perception")) {
    mechanics.push(
      "Sensation is about detecting physical stimulation; perception is about organizing and interpreting that input. The distinction is useful, but in real life the processes interact continuously.",
      "Attention, prior knowledge and context can change what a person notices or how ambiguous input is interpreted."
    );
  } else if (t.includes("learning") || t.includes("conditioning")) {
    mechanics.push(
      "Learning questions usually ask what changes after experience. Classical conditioning links stimuli through association, while operant conditioning focuses on how consequences change the likelihood of behaviour.",
      "A behaviour becoming more frequent after a consequence is not the same thing as the consequence being 'good' in a moral sense; it means the behaviour was strengthened in that context."
    );
  } else if (t.includes("memory") || t.includes("forgetting")) {
    mechanics.push(
      "Memory is best treated as a set of processes rather than one storage box: information is encoded, represented or stored, and later retrieved.",
      "Poor recall does not automatically mean information was never learned. Retrieval conditions, interference, attention and cues can all affect performance."
    );
  } else if (t.includes("motivation") || t.includes("emotion")) {
    mechanics.push(
      "Motivation concerns processes that energize and direct behaviour toward goals. Emotion involves coordinated subjective, physiological, cognitive and behavioural responses.",
      "Students often study motivation and emotion as labels. A stronger approach asks what starts the behaviour, what maintains it, what changes its direction, and what evidence would distinguish competing explanations."
    );
  } else if (t.includes("assessment") || t.includes("measurement") || t.includes("reliability") || t.includes("validity") || t.includes("norm")) {
    mechanics.push(
      "Assessment starts with a question and then selects appropriate sources of information. A test score is evidence, not a diagnosis or final truth by itself.",
      "Reliability is about consistency or precision; validity is about whether evidence supports the intended interpretation or use of a score. A measure can be reliable without being valid for a particular purpose."
    );
  } else if (t.includes("abnormal") || t.includes("anxiety") || t.includes("mood") || t.includes("psychotic")) {
    mechanics.push(
      "Psychological dysfunction is judged using multiple dimensions such as distress, impairment, risk, cultural context and patterns of functioning rather than one unusual behaviour.",
      "Diagnosis is a structured classification process. A symptom can appear across different conditions, so context, duration, pattern and impairment matter."
    );
  } else if (t.includes("self") || t.includes("effectiveness")) {
    mechanics.push(
      "Self-related concepts become more useful when translated into observable behaviour. Ask what a person believes, what they actually do, and what feedback or context changes the pattern.",
      "Avoid treating a single reflection or personality label as a complete explanation of behaviour."
    );
  } else if (t.includes("environment")) {
    mechanics.push(
      "Environmental psychology asks how physical and social settings influence attention, stress, behaviour, identity and decision-making.",
      "A good example considers both the person and the setting instead of blaming behaviour entirely on one side."
    );
  } else {
    mechanics.push(
      `The central mechanism is easier to remember when you can explain what changes, what stays stable, and what conditions make ${title} more or less likely.`,
      `Do not study ${title} as a vocabulary word alone. Connect the definition to a mechanism, an example, a way of measuring or observing it, and one limitation.`
    );
  }

  const studentExample =
    t.includes("phone") || t.includes("attention")
      ? "You sit down to study, a notification arrives, and your attention shifts. The useful question is not simply 'why am I distracted?' but which attentional processes and cues changed at that moment."
      : `Imagine a student learning "${title}" for the first time. They read a definition, try a real example, compare it with a nearby concept, and then answer a question without looking at the notes. That sequence turns recognition into usable understanding.`;

  const everydayExample =
    t.includes("memory")
      ? "You know a friend's name but cannot retrieve it for ten seconds. That temporary failure is a useful reminder that retrieval is not identical to permanent loss of information."
      : t.includes("learning") || t.includes("conditioning")
      ? "A student starts checking their phone more often because each check sometimes produces an interesting message. The behaviour can be understood through learning and reinforcement without assuming anything about the student's character."
      : t.includes("assessment") || t.includes("reliability") || t.includes("validity")
      ? "A student scores 82 on one test and 61 on another similar test. Before calling the student 'less capable', an assessor would ask about measurement conditions, reliability, validity and what the tests actually measure."
      : `A simple everyday example of ${title}: notice the behaviour first, describe what happened, then ask what explanation the concept would predict and what alternative explanation could also fit.`;

  const compare = `Compare ${title} with the closest concept you could confuse it with. Ask: what is the definition of each, what evidence would distinguish them, and where might both appear in the same real situation?`;

  const exam = `For a university answer on ${title}, use a four-part structure: (1) precise definition, (2) explanation of the mechanism or model, (3) concrete example, and (4) one limitation, boundary or alternative explanation.`;

  const limitation = `A limitation is not simply 'there may be exceptions'. Ask what the concept does not explain, what assumptions it makes, how it is measured, and whether evidence from one population or setting can be generalized.`;

  return [
    `## Start from zero\nStart from zero: first understand the ordinary-language meaning of the topic, then add the scientific detail.\n\n${baseNotes}`,
    `## Start here\n${quickExplanation}`,
    `## How to think about it\n${mechanics[0]}`,
    `## How it works / what to notice\n${mechanics[1]}`,
    `## Real-life example: student life\n${studentExample}`,
    `## Real-life example: outside class\n${everydayExample}`,
    `## Compare instead of memorise\n${compare}`,
    `## Evidence and measurement\nAsk what would count as convincing evidence for this concept. Depending on the topic, that could involve experiments, observation, interviews, standardized measures, physiological measures, longitudinal work or other appropriate methods. A strong answer separates a claim from the evidence used to support it.`,
    `## Exam answer blueprint\n${exam}`,
    `## What not to oversimplify\n${limitation} ${focus}`,
    `## Final memory hook\nSay the concept aloud in your own words. Then explain the same idea to a fictional classmate using one example and one contrast. If you cannot do both without looking, you do not know it well enough yet.`
  ].join("\n\n");
}

function enrichTopicSeed(t: TopicSeed): TopicSeed {
  const notes = expandStudyNotes(
    t.subject,
    t.title,
    t.quickExplanation,
    t.examFocus,
    t.detailedNotes
  );
  const examples = Array.from(new Set([
    ...(Array.isArray(t.examples) ? t.examples : []),
    `Student-life example: ${t.title} appears when you are studying, making decisions, interacting with other people or trying to change a habit.`,
    `Exam example: explain ${t.title} using a concrete situation first, then name the psychological mechanism that fits it.`
  ])).slice(0, 6);

  const keyTerms = Array.from(new Set([
    ...(Array.isArray(t.keyTerms) ? t.keyTerms : []),
    "Mechanism",
    "Application",
    "Evidence",
    "Limitation"
  ])).slice(0, 10);

  const example1 = examples[0] || "A concrete everyday example.";
  const example2 = examples[1] || "A second application example.";
  const mindMap = [
    { id: "root", label: t.title, detail: t.quickExplanation, level: 0 },
    { id: "definition", label: "Definition", parent: "root", detail: t.quickExplanation, level: 1 },
    { id: "mechanism", label: "How it works", parent: "root", detail: "Explain the process, model or sequence.", level: 1 },
    { id: "example", label: "Real-life example", parent: "root", detail: example1, level: 1 },
    { id: "compare", label: "Compare", parent: "root", detail: "Contrast it with the closest confusing concept.", level: 1 },
    { id: "evidence", label: "Evidence", parent: "root", detail: "Ask how this concept could be observed or measured.", level: 1 },
    { id: "exam", label: "Exam hook", parent: "root", detail: t.examFocus, level: 1 },
    { id: "example2", label: "Student example", parent: "example", detail: example2, level: 2 },
    { id: "mistake", label: "Common trap", parent: "compare", detail: t.commonMistakes, level: 2 },
    { id: "remember", label: "Recall cue", parent: "exam", detail: t.quickRevision, level: 2 }
  ];

  return {
    ...t,
    detailedNotes: notes,
    examples: examples,
    keyTerms,
    mindMap
  };
}

function richTopic(
  subject: string,
  unitNumber: number,
  unitTitle: string,
  title: string,
  focus: string
): TopicSeed {
  const slug = `${subject}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const definitions: Record<string,string> = {
    "attention":"Attention is the selective allocation of limited cognitive processing resources.",
    "memory":"Memory involves encoding, storage and retrieval processes rather than a single mental container.",
    "learning":"Learning refers to relatively enduring changes associated with experience, practice or adaptation.",
    "stress":"Stress involves demands or challenges that are appraised as taxing or exceeding available resources.",
    "reliability":"Reliability concerns the consistency or precision of measurement.",
    "validity":"Validity concerns evidence supporting intended interpretations and uses of scores.",
    "motivation":"Motivation concerns processes that energize, direct and sustain goal-related behaviour.",
    "emotion":"Emotion involves coordinated changes in subjective experience, physiology, cognition and action tendencies."
  };
  const lower = title.toLowerCase();
  const oneMinute = Object.entries(definitions).find(([k])=>lower.includes(k))?.[1]
    ?? `${title} is a core concept within ${subject}. Start by defining it precisely, then learn its major components, examples, evidence and limitations.`;
  const detailed = [
    `${title} should be learned as a concept with boundaries, not as a one-line definition.`,
    `Start with the central question: what does this concept explain, measure or help us understand?`,
    `Then break it into components. Compare each component with the concepts most likely to be confused with it.`,
    `Use an example from everyday student life, then ask whether the example actually fits the definition or only resembles it superficially.`,
    `For university-level answers, state the concept, explain the mechanism or model, give an example, and add one limitation or contextual qualification.`,
    `Study cue: ${focus}`
  ].join("\n\n");
  const terms = [title, "Definition", "Components", "Application", "Evidence", "Limitations"];
  const examples = [
    `A student encounters ${title} while studying and can explain the concept using a concrete classroom example.`,
    `A researcher could operationalize an aspect of ${title} and compare it across people or conditions.`
  ];
  const cards:[string,string][] = [
    [`What is ${title}?`, oneMinute],
    [`What is the main study question for ${title}?`, `What it is, how it works, how it is measured or observed, and where its limits are.`],
    [`What should a strong exam answer add?`, `A definition, explanation, example and a limitation or contextual qualification.`],
    [`What is the biggest revision trap?`, `Memorizing a label without understanding what the concept predicts or distinguishes.`]
  ];
  const options = [title, "A completely unrelated concept", "A mathematical constant", "A diagnosis"];
  return {
    subject, unit: unitNumber, unitTitle, slug, title,
    description: `${title}: a structured undergraduate study topic within ${subject}.`,
    learningObjectives: `By the end of this topic, explain ${title}, identify its main elements, apply it to an example, and distinguish it from closely related ideas.`,
    quickExplanation: oneMinute,
    detailedNotes: expandStudyNotes(subject, title, oneMinute, `Exam focus: ${focus}`, detailed),
    keyTerms: terms,
    examples,
    importantPsychologists: [],
    examFocus: `Define ${title} precisely; explain the mechanism or framework; use one example; mention one limitation.`,
    commonMistakes: `Do not reduce ${title} to a slogan. Context, measurement and alternative explanations matter.`,
    quickRevision: `${title}: definition → components → example → evidence → limitation.`,
    mindMap: [
      {id:"root",label:title,detail:oneMinute,level:0},
      {id:"b1",label:"Definition",parent:"root",detail:oneMinute,level:1},
      {id:"b2",label:"How it works",parent:"root",detail:"Break the mechanism into a sequence or model.",level:1},
      {id:"b3",label:"Real-life example",parent:"root",detail:examples[0],level:1},
      {id:"b4",label:"Compare",parent:"root",detail:"Contrast the nearest confusing concept.",level:1},
      {id:"b5",label:"Evidence",parent:"root",detail:"Ask how the concept could be observed or measured.",level:1},
      {id:"b6",label:"Exam hook",parent:"root",detail:`Define → explain → example → limitation.`,level:1},
      {id:"s1",label:"Recall",parent:"b1",detail:"Say the definition without looking.",level:2},
      {id:"s2",label:"Process",parent:"b2",detail:"Explain the mechanism in your own words.",level:2},
      {id:"s3",label:"Student example",parent:"b3",detail:examples[1],level:2},
      {id:"s4",label:"Common trap",parent:"b4",detail:`Do not oversimplify ${title}.`,level:2},
      {id:"s5",label:"Revision cue",parent:"b6",detail:`${title}: definition → mechanism → application → limitation.`,level:2}
    ],
    flashcards: cards,
    mcqs: mcqSet(title, oneMinute, options, 0, oneMinute)
  };
}

async function ensureOfficialSemesters(courseId: string) {
  for (let n = 1; n <= 6; n++) {
    const yearNumber = Math.ceil(n / 2);
    const year = await db.academicYear.upsert({
      where: { courseId_number: { courseId, number: yearNumber } },
      update: {},
      create: { courseId, number: yearNumber }
    });
    await db.semester.upsert({
      where: { yearId_number: { yearId: year.id, number: n } },
      update: {},
      create: { yearId: year.id, number: n }
    });
  }
  for (const [nRaw, names] of Object.entries(OFFICIAL_SEMESTERS)) {
    const n = Number(nRaw);
    const semester = await db.semester.findFirstOrThrow({
      where: { number:n, year:{courseId} }
    });
    for (const name of names) {
      await db.subject.upsert({
        where: { semesterId_name: { semesterId: semester.id, name } },
        update: {},
        create: { semesterId: semester.id, name }
      });
    }
  }
}

async function seedFullCurriculum(courseId: string) {
  await ensureOfficialSemesters(courseId);

  for (const [nRaw, subjectNames] of Object.entries(OFFICIAL_SEMESTERS)) {
    const semesterNumber = Number(nRaw);
    const semester = await db.semester.findFirstOrThrow({
      where: { number: semesterNumber, year: { courseId } },
      include: { subjects: true }
    });

    for (const subject of semester.subjects) {
      const blueprint = BLUEPRINTS[subject.name];
      if (!blueprint) continue;

      const unit = await db.unit.upsert({
        where: { subjectId_number: { subjectId: subject.id, number: 1 } },
        update: { title: blueprint.unit },
        create: { subjectId: subject.id, number:1, title: blueprint.unit }
      });

      for (const title of blueprint.topics) {
        const t = richTopic(subject.name, 1, blueprint.unit, title, blueprint.focus);
        const topic = await db.topic.upsert({
          where: { slug: t.slug },
          update: {
            title:t.title, description:t.description, learningObjectives:t.learningObjectives,
            quickExplanation:t.quickExplanation, detailedNotes:t.detailedNotes, keyTerms:t.keyTerms,
            examples:t.examples, importantPsychologists:t.importantPsychologists, examFocus:t.examFocus,
            commonMistakes:t.commonMistakes, quickRevision:t.quickRevision, mindMap:t.mindMap,
            subjectId:subject.id, unitId:unit.id
          },
          create: {
            slug:t.slug, title:t.title, description:t.description, learningObjectives:t.learningObjectives,
            quickExplanation:t.quickExplanation, detailedNotes:t.detailedNotes, keyTerms:t.keyTerms,
            examples:t.examples, importantPsychologists:t.importantPsychologists, examFocus:t.examFocus,
            commonMistakes:t.commonMistakes, quickRevision:t.quickRevision, mindMap:t.mindMap,
            subjectId:subject.id, unitId:unit.id
          }
        });

        await db.flashcard.deleteMany({ where:{topicId:topic.id} });
        for (const [front,back] of t.flashcards) {
          await db.flashcard.create({ data:{topicId:topic.id,front,back} });
        }
        await db.mCQ.deleteMany({ where:{topicId:topic.id} });
        for (const m of t.mcqs) {
          await db.mCQ.create({data:{topicId:topic.id,...m}});
        }
      }
    }
  }
}

async function main() {
  await db.$executeRawUnsafe("PRAGMA foreign_keys = ON");

  const university = await db.university.upsert({
    where: { name: "Amity University Punjab" },
    update: {},
    create: { name: "Amity University Punjab" }
  });

  const course = await db.course.upsert({
    where: { id: "amity-aup-bsc-clinical-psychology" },
    update: { name: "B.Sc. (Clinical Psychology)", durationYears: 3, universityId: university.id },
    create: { id: "amity-aup-bsc-clinical-psychology", name: "B.Sc. (Clinical Psychology)", durationYears: 3, universityId: university.id }
  });

  for (let y = 1; y <= 3; y++) {
    const year = await db.academicYear.upsert({
      where: { courseId_number: { courseId: course.id, number: y } },
      update: {},
      create: { courseId: course.id, number: y }
    });
    for (let n = 1; n <= 2; n++) {
      const semesterNumber = (y - 1) * 2 + n;
      await db.semester.upsert({
        where: { yearId_number: { yearId: year.id, number: semesterNumber } },
        update: {},
        create: { yearId: year.id, number: semesterNumber }
      });
    }
  }

  await ensureOfficialSemesters(course.id);
  await seedFullCurriculum(course.id);

  const semester1 = await db.semester.findFirstOrThrow({
    where: { number: 1, year: { courseId: course.id } }
  });

  const subjectNames = [
    "Indian Wisdom for Nation Building",
    "Wellness, Yoga and Sports for Sustainable Living",
    "Psychological Assessment",
    "Biological Basis of Behaviour",
    "Fundamentals of Psychology",
    "Practicum::I",
    "Fundamentals of Economics",
    "Elementary French: Communication and Culture for Beginners",
    "Elementary German: Communication and Culture for Beginners"
  ];

  for (const name of subjectNames) {
    await db.subject.upsert({
      where: { semesterId_name: { semesterId: semester1.id, name } },
      update: {},
      create: { semesterId: semester1.id, name }
    });
  }

  for (const rawTopic of topics) {
    const t = enrichTopicSeed(rawTopic);
    const subject = await db.subject.findUniqueOrThrow({
      where: { semesterId_name: { semesterId: semester1.id, name: t.subject } }
    });

    const unit = await db.unit.upsert({
      where: { subjectId_number: { subjectId: subject.id, number: t.unit } },
      update: { title: t.unitTitle },
      create: { subjectId: subject.id, number: t.unit, title: t.unitTitle }
    });

    const topic = await db.topic.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title, description: t.description, learningObjectives: t.learningObjectives,
        quickExplanation: t.quickExplanation, detailedNotes: t.detailedNotes,
        keyTerms: t.keyTerms, examples: t.examples, importantPsychologists: t.importantPsychologists,
        examFocus: t.examFocus, commonMistakes: t.commonMistakes, quickRevision: t.quickRevision,
        mindMap: [
          { id: "root", label: t.title },
          { id: "k1", label: t.keyTerms[0], parent: "root" },
          { id: "k2", label: t.keyTerms[1], parent: "root" },
          { id: "k3", label: t.keyTerms[2], parent: "root" }
        ],
        subjectId: subject.id, unitId: unit.id
      },
      create: {
        slug: t.slug, title: t.title, description: t.description, learningObjectives: t.learningObjectives,
        quickExplanation: t.quickExplanation, detailedNotes: t.detailedNotes,
        keyTerms: t.keyTerms, examples: t.examples, importantPsychologists: t.importantPsychologists,
        examFocus: t.examFocus, commonMistakes: t.commonMistakes, quickRevision: t.quickRevision,
        mindMap: [
          { id: "root", label: t.title },
          { id: "k1", label: t.keyTerms[0], parent: "root" },
          { id: "k2", label: t.keyTerms[1], parent: "root" },
          { id: "k3", label: t.keyTerms[2], parent: "root" }
        ],
        subjectId: subject.id, unitId: unit.id
      }
    });

    await db.flashcard.deleteMany({ where: { topicId: topic.id } });
    for (const [front, back] of t.flashcards) {
      await db.flashcard.create({ data: { topicId: topic.id, front, back } });
    }

    await db.mCQ.deleteMany({ where: { topicId: topic.id } });
    for (const m of t.mcqs) {
      await db.mCQ.create({ data: { topicId: topic.id, ...m } });
    }
  }

  const people = [
    ["Wilhelm Wundt","1832–1920","German psychologist and physiologist associated with the institutional development of experimental psychology and the Leipzig laboratory.","Experimental psychology",["Experimental psychology","Introspection"],["History of Psychology","Experimental Psychology"]],
    ["William James","1842–1910","American philosopher and psychologist associated with functionalism and influential work on consciousness and habit.","The Principles of Psychology",["Functionalism","Stream of consciousness"],["History of Psychology","Fundamentals of Psychology"]],
    ["Sigmund Freud","1856–1939","Austrian neurologist and founder of psychoanalysis; historically influential and strongly debated in contemporary psychology.","The Interpretation of Dreams",["Psychoanalysis","Unconscious processes"],["History of Psychology","Psychotherapy"]],
    ["B.F. Skinner","1904–1990","American psychologist associated with radical behaviourism and research on operant conditioning.","The Behavior of Organisms",["Operant conditioning","Behaviourism"],["Learning","Psychotherapy"]],
    ["Ivan Pavlov","1849–1936","Russian physiologist whose work on conditioned reflexes became foundational to classical conditioning.","Conditioned Reflex Research",["Classical conditioning","Conditioned reflex"],["Learning","Biological Basis of Behaviour"]],
    ["Edward Thorndike","1874–1949","American psychologist whose work on the law of effect influenced the development of behaviourism and learning theory.","Animal Intelligence",["Law of effect","Learning"],["Learning","Fundamentals of Psychology"]],
    ["Jean Piaget","1896–1980","Swiss psychologist known for a stage-based theory of cognitive development in childhood.","The Origins of Intelligence in Children",["Cognitive development","Schemas"],["Developmental Psychology","Cognitive Psychology"]],
    ["Lev Vygotsky","1896–1934","Soviet psychologist whose sociocultural theory emphasized language, tools and social interaction in development.","Mind in Society",["Sociocultural theory","Zone of proximal development"],["Developmental Psychology","Cognitive Psychology"]],
    ["Albert Bandura","1925–2021","Canadian-American psychologist known for social learning/social cognitive theory and research on observational learning.","Social Learning Theory",["Observational learning","Self-efficacy"],["Personality and Behaviour","Developmental Psychology"]],
    ["Carl Rogers","1902–1987","American psychologist and major humanistic theorist who emphasized the therapeutic relationship and person-centred growth.","On Becoming a Person",["Person-centred therapy","Unconditional positive regard"],["Psychotherapy","Clinical Psychology"]],
    ["Abraham Maslow","1908–1970","American psychologist associated with humanistic psychology and a hierarchical account of human needs.","Motivation and Personality",["Humanistic psychology","Needs"],["Positive Psychology","Motivation"]],
    ["Aaron Beck","1921–2021","American psychiatrist and pioneer of cognitive therapy, emphasizing the role of interpretations and beliefs in emotional distress.","Cognitive Therapy and the Emotional Disorders",["Cognitive therapy","Automatic thoughts"],["Psychotherapy","Clinical Psychology"]],
    ["Albert Ellis","1913–2007","American psychologist who developed rational emotive behaviour therapy, emphasizing beliefs and disputation.","Reason and Emotion in Psychotherapy",["REBT","Cognitive restructuring"],["Psychotherapy","Stress Management"]],
    ["Mary Ainsworth","1913–1999","American-Canadian developmental psychologist known for the Strange Situation and attachment research.","Patterns of Attachment",["Attachment","Strange Situation"],["Developmental Psychology","Child Mental Health"]],
    ["John Bowlby","1907–1990","British psychiatrist and psychoanalyst who developed attachment theory emphasizing early relationships and security.","Attachment and Loss",["Attachment theory","Secure base"],["Developmental Psychology","Child Mental Health"]],
    ["Paul Ekman","1934–","American psychologist known for research on facial expression and emotion, including cross-cultural questions about emotional expression.","Emotion research",["Facial expression","Emotion"],["Emotional Intelligence","Positive Psychology"]],
    ["Daniel Kahneman","1934–2024","Psychologist whose research on judgment and decision-making explored heuristics, biases and dual-process ideas.","Thinking, Fast and Slow",["Heuristics","Cognitive biases"],["Cognitive Psychology","Fundamentals of Psychology"]],
    ["Elizabeth Loftus","1944–","American psychologist known for research showing how memory can be influenced by suggestion and misinformation.","Eyewitness memory research",["Misinformation effect","Memory"],["Forensic Psychology","Cognitive Psychology"]],
    ["David Wechsler","1896–1981","Psychologist known for major individually administered intelligence scales.","Wechsler intelligence scales",["Intelligence testing","Assessment"],["Psychological Assessment"]],
    ["Anne Anastasi","1908–2001","American psychologist and author influential in psychological testing and the interpretation of individual differences.","Psychological Testing",["Psychological testing","Individual differences"],["Psychological Assessment"]],
    ["Santiago Ramón y Cajal","1852–1934","Spanish neuroscientist whose microscopic work strongly supported the neuron doctrine.","Histological Studies of the Nervous System",["Neuron doctrine","Neuroscience"],["Biological Basis of Behaviour","Neuropsychology"]],
    ["Brenda Milner","1918–2024","Canadian neuropsychologist whose work with patient H.M. transformed understanding of memory systems.","Memory and Neuropsychology",["Memory systems","Neuropsychology"],["Neuropsychology","Cognitive Psychology"]],
    ["Roger Sperry","1913–1994","American neuropsychologist whose split-brain research advanced understanding of cerebral lateralization.","Split-brain research",["Lateralization","Split brain"],["Neuropsychology","Biological Basis of Behaviour"]],
    ["Stanley Schachter","1922–1997","American psychologist associated with research on emotion and social psychological processes.","Emotion research",["Two-factor theory of emotion"],["Emotion","Social Psychology"]],
    ["Kurt Lewin","1890–1947","German-American psychologist influential in social psychology and field theory.","Field Theory",["Field theory","Group dynamics"],["Social Psychology","Workplace Psychology"]]
  ];
  for (const [name, era, biography, majorWork, theories, relatedTopics] of people) {
    const id = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.psychologist.upsert({
      where: { id },
      update: { name, era, biography, majorWork, theories, relatedTopics },
      create: { id, name, era, biography, majorWork, theories, relatedTopics }
    });
  }

  const extraPeople = [
    ["Erik Erikson","1902–1994","German-American developmental theorist associated with psychosocial development across the lifespan.","Childhood and Society",["Psychosocial stages","Identity"],["Developmental Psychology","Personality"]],
    ["Lawrence Kohlberg","1927–1987","American psychologist known for research on moral reasoning and stages of moral development.","The Philosophy of Moral Development",["Moral development","Moral reasoning"],["Developmental Psychology","Ethics"]],
    ["Harry Harlow","1905–1981","American psychologist known for influential and controversial studies of attachment and social isolation in rhesus monkeys.","The Nature of Love",["Attachment","Maternal contact"],["Developmental Psychology","Child Mental Health"]],
    ["Solomon Asch","1907–1996","Polish-American social psychologist known for classic research on conformity and group pressure.","Effects of Group Pressure upon the Modification and Distortion of Judgments",["Conformity","Social influence"],["Social Psychology"]],
    ["Stanley Milgram","1933–1984","American social psychologist known for research on obedience to authority, with major ethical discussion around the studies.","Obedience to Authority",["Obedience","Authority"],["Social Psychology","Ethics"]],
    ["Philip Zimbardo","1933–","American psychologist associated with work on social roles, situations and the Stanford Prison Experiment, which remains heavily debated on methodological and ethical grounds.","The Lucifer Effect",["Situational influence","Social roles"],["Social Psychology","Ethics"]],
    ["Leon Festinger","1919–1989","American social psychologist who developed cognitive dissonance theory and investigated social comparison.","A Theory of Cognitive Dissonance",["Cognitive dissonance","Social comparison"],["Social Psychology","Cognitive Psychology"]],
    ["George Miller","1920–2012","American cognitive psychologist whose work helped establish cognitive psychology and research on memory capacity.","The Magical Number Seven, Plus or Minus Two",["Working memory","Information processing"],["Cognitive Psychology","Memory"]],
    ["Endel Tulving","1927–2023","Canadian cognitive psychologist whose work distinguished episodic and semantic memory.","Episodic and Semantic Memory",["Episodic memory","Semantic memory"],["Cognitive Psychology","Memory"]],
    ["Ulric Neisser","1928–2012","German-American psychologist often described as a founder of cognitive psychology and author of a major early cognitive text.","Cognitive Psychology",["Cognitive psychology","Information processing"],["Cognitive Psychology","History of Psychology"]],
    ["David Rosenhan","1929–2012","American psychologist known for the controversial pseudo-patient study on psychiatric diagnosis and institutional contexts.","On Being Sane in Insane Places",["Diagnosis","Institutional context"],["Abnormal Psychology","Clinical Psychology"]],
    ["Martin Seligman","1942–","American psychologist associated with learned helplessness and the development of positive psychology.","Learned Optimism",["Positive psychology","Learned helplessness"],["Positive Psychology","Health Psychology"]]
  ];
  for (const [name, era, biography, majorWork, theories, relatedTopics] of extraPeople) {
    const id = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await db.psychologist.upsert({
      where: { id },
      update: { name, era, biography, majorWork, theories, relatedTopics },
      create: { id, name, era, biography, majorWork, theories, relatedTopics }
    });
  }

  const achievements = [
    ["First Topic", "Complete your first topic.", 50],
    ["100 MCQs", "Attempt 100 MCQs.", 100],
    ["90% Accuracy", "Reach 90% quiz accuracy.", 150],
    ["First Mock Exam", "Submit your first mock exam.", 100],
    ["Semester Completed", "Complete a semester.", 500],
    ["7-Day Streak", "Study for seven consecutive days.", 250]
  ];
  for (const [name, description, xp] of achievements) {
    await db.achievement.upsert({
      where: { name: String(name) },
      update: { description: String(description), xp: Number(xp) },
      create: { name: String(name), description: String(description), xp: Number(xp) }
    });
  }

  const allMcqs = await db.mCQ.findMany({
    where: { topic: { subject: { semesterId: semester1.id } } },
    take: 45
  });

  const exam = await db.mockExam.upsert({
    where: { id: "semester-1-mock-1" },
    update: { title: "Semester 1 Mock Paper 1", durationMin: 15 },
    create: { id: "semester-1-mock-1", title: "Semester 1 Mock Paper 1", durationMin: 15, semesterId: semester1.id }
  });

  await db.mockQuestion.deleteMany({ where: { examId: exam.id } });
  for (let i = 0; i < allMcqs.length; i++) {
    await db.mockQuestion.create({
      data: { examId: exam.id, mcqId: allMcqs[i].id, order: i + 1 }
    });
  }


  // Create three mock papers per semester. Questions are sampled from that
  // semester's published study topics; no placeholder exam screens.
  for (let n = 1; n <= 6; n++) {
    const semester = await db.semester.findFirst({ where:{ number:n, year:{courseId:course.id} } });
    if (!semester) continue;
    const semesterMcqs = await db.mCQ.findMany({
      where:{ topic:{subject:{semesterId:semester.id}} },
      orderBy:{id:"asc"}
    });

    for (let paper = 1; paper <= 5; paper++) {
      const examId = `semester-${n}-mock-${paper}`;
      const exam = await db.mockExam.upsert({
        where:{id:examId},
        update:{title:`Semester ${n} Mock Paper ${paper}`,durationMin:15},
        create:{id:examId,title:`Semester ${n} Mock Paper ${paper}`,durationMin:15,semesterId:semester.id}
      });
      await db.mockQuestion.deleteMany({where:{examId}});
      const startAt = ((paper - 1) * 45) % Math.max(1, semesterMcqs.length);
      const ordered = [...semesterMcqs.slice(startAt), ...semesterMcqs.slice(0, startAt)];
      const picked = ordered.slice(0, 45);
      for (let i=0;i<picked.length;i++) {
        await db.mockQuestion.create({data:{examId,mcqId:picked[i].id,order:i+1}});
      }
    }
  }

  console.log("✅ Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(() => db.$disconnect());
