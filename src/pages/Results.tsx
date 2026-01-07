import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, RotateCcw, CheckCircle2, TrendingUp, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';
import { useInterview } from '@/contexts/InterviewContext';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { state, resetInterview } = useInterview();

  const getScoreColor = (score: number): 'success' | 'warning' | 'accent' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'accent';
  };

  const getGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const handleNewInterview = () => {
    resetInterview();
    navigate('/');
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF
    const report = {
      score: state.overallScore,
      grade: getGrade(state.overallScore),
      strengths: state.strengths,
      improvements: state.improvements,
      answers: state.answers.map((a, i) => ({
        question: state.questions.find(q => q.id === a.questionId)?.text,
        answer: a.text,
        score: a.score,
        feedback: a.feedback,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Interview Complete! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your detailed performance analysis
          </p>
        </div>

        {/* Score Card */}
        <div className="glass-card-elevated rounded-2xl p-8 mb-8 animate-scale-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <ProgressRing
                progress={state.overallScore}
                size={180}
                strokeWidth={14}
                color={getScoreColor(state.overallScore)}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-bold text-foreground">{state.overallScore}</span>
                <span className="text-lg text-muted-foreground block">/ 100</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success font-semibold mb-4">
                <Star className="w-5 h-5" />
                Grade: {getGrade(state.overallScore)}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {state.overallScore >= 80
                  ? 'Excellent Performance!'
                  : state.overallScore >= 60
                  ? 'Good Job!'
                  : 'Room for Improvement'}
              </h2>
              <p className="text-muted-foreground">
                You answered {state.answers.length} questions with an average score of {state.overallScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Strengths
            </h3>
            <ul className="space-y-3">
              {state.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-2xl p-6 animate-slide-up delay-100">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Areas to Improve
            </h3>
            <ul className="space-y-3">
              {state.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <span className="text-muted-foreground">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up delay-200">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            Question-by-Question Breakdown
          </h3>
          <div className="space-y-6">
            {state.answers.map((answer, index) => {
              const question = state.questions.find(q => q.id === answer.questionId);
              return (
                <div
                  key={answer.questionId}
                  className="border-b border-border last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Q{index + 1}
                        </span>
                        <span className="skill-badge skill-badge-neutral text-xs">
                          {question?.skill}
                        </span>
                      </div>
                      <p className="font-medium text-foreground">{question?.text}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <ProgressRing
                        progress={answer.score || 0}
                        size={60}
                        strokeWidth={6}
                        color={getScoreColor(answer.score || 0)}
                      />
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 mb-3">
                    <p className="text-sm text-muted-foreground mb-1">Your Answer:</p>
                    <p className="text-foreground">{answer.text || 'No response recorded'}</p>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                    <p className="text-sm text-accent mb-1">AI Feedback:</p>
                    <p className="text-muted-foreground">{answer.feedback}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
          <Button variant="outline" size="lg" onClick={handleDownloadReport}>
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </Button>
          <Button variant="hero" size="lg" onClick={handleNewInterview}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
