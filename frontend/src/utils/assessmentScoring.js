import { assessmentQuestions, assessmentSections, defaultCareerPreviews } from './assessmentData';

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

export function getQuestionSection(question) {
  return assessmentSections.find((section) => section.id === question.sectionId);
}

export function getAnsweredCount(answers) {
  return assessmentQuestions.filter((question) => {
    const answer = answers[question.id];
    return Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== '';
  }).length;
}

export function getCompletionPercentage(answers) {
  return clamp((getAnsweredCount(answers) / assessmentQuestions.length) * 100);
}

export function isQuestionAnswered(question, answers) {
  const answer = answers[question.id];
  if (question.type === 'multi') return Array.isArray(answer) && answer.length >= (question.minSelections || 1);
  return answer !== undefined && answer !== '';
}

export function getMissingRequiredQuestions(answers) {
  return assessmentQuestions.filter((question) => question.required && !isQuestionAnswered(question, answers));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
}

export function calculateAssessmentResult(answers) {
  const technicalQuestions = assessmentQuestions.filter((q) => q.sectionId === 'technical');
  const aptitudeQuestions = assessmentQuestions.filter((q) => q.sectionId === 'aptitude');
  const personalityQuestions = assessmentQuestions.filter((q) => q.sectionId === 'personality');
  const interestQuestion = assessmentQuestions.find((q) => q.sectionId === 'interests');

  const technicalScore = clamp((average(technicalQuestions.map((q) => answers[q.id])) / 5) * 100);
  const aptitudeScore = clamp((aptitudeQuestions.filter((q) => answers[q.id] === q.correctAnswer).length / aptitudeQuestions.length) * 100);
  const personalityScore = clamp((average(personalityQuestions.map((q) => answers[q.id])) / 5) * 100);
  const selectedInterests = answers[interestQuestion.id] || [];
  const interestScore = clamp((selectedInterests.length / interestQuestion.options.length) * 100);
  const overallScore = clamp((technicalScore * 0.3) + (aptitudeScore * 0.3) + (personalityScore * 0.2) + (interestScore * 0.2));

  const technicalBySkill = technicalQuestions.map((question) => ({
    subject: question.skill,
    score: clamp((Number(answers[question.id] || 0) / 5) * 100),
  }));

  const interestDistribution = selectedInterests.map((name, index) => ({
    name,
    value: Math.max(8, 100 - index * 7),
  }));

  const personalityType = personalityScore >= 82
    ? 'Strategic Builder'
    : personalityScore >= 68
      ? 'Collaborative Problem Solver'
      : 'Adaptive Explorer';

  const strengths = [
    technicalScore >= 70 ? 'Strong technical foundation' : 'Fast technical growth potential',
    aptitudeScore >= 70 ? 'Clear analytical reasoning' : 'Good problem framing instinct',
    selectedInterests.includes('Data Science') || selectedInterests.includes('Artificial Intelligence') ? 'Data-driven curiosity' : 'Broad domain curiosity',
  ];

  const improvementAreas = [
    technicalScore < 75 ? 'Deepen one core programming stack' : 'Practice system design depth',
    aptitudeScore < 75 ? 'Build speed with reasoning practice' : 'Improve advanced numerical fluency',
    selectedInterests.length < 5 ? 'Explore adjacent career domains' : 'Prioritize your top two interests',
  ];

  return {
    overallScore,
    technicalScore,
    aptitudeScore,
    personalityScore,
    interestScore,
    technicalBySkill,
    interestDistribution,
    personalityType,
    strengths,
    improvementAreas,
    careers: defaultCareerPreviews,
  };
}
