import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Skill {
  name: string;
  category: string;
  matched: boolean;
}

export interface Question {
  id: number;
  text: string;
  skill: string;
}

export interface Answer {
  questionId: number;
  text: string;
  score?: number;
  feedback?: string;
}

export interface InterviewState {
  resumeText: string;
  jobDescriptionText: string;
  resumeFile: File | null;
  jobDescriptionFile: File | null;
  matchedSkills: Skill[];
  missingSkills: Skill[];
  matchPercentage: number;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  isAnalyzing: boolean;
  isGeneratingQuestions: boolean;
  isEvaluating: boolean;
}

interface InterviewContextType {
  state: InterviewState;
  setResumeFile: (file: File | null) => void;
  setJobDescriptionFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  setJobDescriptionText: (text: string) => void;
  setAnalysisResults: (matched: Skill[], missing: Skill[], percentage: number) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: Answer) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setEvaluationResults: (score: number, strengths: string[], improvements: string[], answers: Answer[]) => void;
  setIsAnalyzing: (value: boolean) => void;
  setIsGeneratingQuestions: (value: boolean) => void;
  setIsEvaluating: (value: boolean) => void;
  resetInterview: () => void;
}

const initialState: InterviewState = {
  resumeText: '',
  jobDescriptionText: '',
  resumeFile: null,
  jobDescriptionFile: null,
  matchedSkills: [],
  missingSkills: [],
  matchPercentage: 0,
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  overallScore: 0,
  strengths: [],
  improvements: [],
  isAnalyzing: false,
  isGeneratingQuestions: false,
  isEvaluating: false,
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<InterviewState>(initialState);

  const setResumeFile = (file: File | null) => {
    setState(prev => ({ ...prev, resumeFile: file }));
  };

  const setJobDescriptionFile = (file: File | null) => {
    setState(prev => ({ ...prev, jobDescriptionFile: file }));
  };

  const setResumeText = (text: string) => {
    setState(prev => ({ ...prev, resumeText: text }));
  };

  const setJobDescriptionText = (text: string) => {
    setState(prev => ({ ...prev, jobDescriptionText: text }));
  };

  const setAnalysisResults = (matched: Skill[], missing: Skill[], percentage: number) => {
    setState(prev => ({
      ...prev,
      matchedSkills: matched,
      missingSkills: missing,
      matchPercentage: percentage,
    }));
  };

  const setQuestions = (questions: Question[]) => {
    setState(prev => ({ ...prev, questions }));
  };

  const addAnswer = (answer: Answer) => {
    setState(prev => ({
      ...prev,
      answers: [...prev.answers.filter(a => a.questionId !== answer.questionId), answer],
    }));
  };

  const setCurrentQuestionIndex = (index: number) => {
    setState(prev => ({ ...prev, currentQuestionIndex: index }));
  };

  const setEvaluationResults = (score: number, strengths: string[], improvements: string[], answers: Answer[]) => {
    setState(prev => ({
      ...prev,
      overallScore: score,
      strengths,
      improvements,
      answers,
    }));
  };

  const setIsAnalyzing = (value: boolean) => {
    setState(prev => ({ ...prev, isAnalyzing: value }));
  };

  const setIsGeneratingQuestions = (value: boolean) => {
    setState(prev => ({ ...prev, isGeneratingQuestions: value }));
  };

  const setIsEvaluating = (value: boolean) => {
    setState(prev => ({ ...prev, isEvaluating: value }));
  };

  const resetInterview = () => {
    setState(initialState);
  };

  return (
    <InterviewContext.Provider
      value={{
        state,
        setResumeFile,
        setJobDescriptionFile,
        setResumeText,
        setJobDescriptionText,
        setAnalysisResults,
        setQuestions,
        addAnswer,
        setCurrentQuestionIndex,
        setEvaluationResults,
        setIsAnalyzing,
        setIsGeneratingQuestions,
        setIsEvaluating,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
