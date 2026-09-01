export type TopicPayload = {
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
  mindMap: {id:string; label:string; parent?:string}[];
  flashcards: {front:string; back:string}[];
  mcqs: {question:string; options:string[]; answerIndex:number; explanation:string; difficulty:string}[];
};
