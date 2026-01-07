import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Square, Circle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoRecorder from '@/components/VideoRecorder';
import { useInterview } from '@/contexts/InterviewContext';

const Interview: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    addAnswer,
    setCurrentQuestionIndex,
    setEvaluationResults,
    setIsEvaluating,
  } = useInterview();

  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
  const progress = state.questions.length > 0 
    ? ((state.currentQuestionIndex + 1) / state.questions.length) * 100 
    : 0;

  // Redirect to dashboard if no questions
  if (state.questions.length === 0 && !state.isEvaluating) {
    navigate('/dashboard');
    return null;
  }

  const handleTranscript = useCallback((text: string) => {
    setCurrentTranscript(prev => prev + ' ' + text);
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentTranscript('');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (currentTranscript.trim()) {
      addAnswer({
        questionId: currentQuestion.id,
        text: currentTranscript.trim(),
      });
      setHasAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleFinishInterview();
    } else {
      setCurrentQuestionIndex(state.currentQuestionIndex + 1);
      setCurrentTranscript('');
      setHasAnswered(false);
    }
  };

  const handleFinishInterview = async () => {
    setIsEvaluating(true);

    // Simulate evaluation (in real app, this would call the AI API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock evaluation results
    const evaluatedAnswers = state.answers.map(answer => ({
      ...answer,
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      feedback: 'Good response demonstrating solid understanding of the concept. Consider providing more specific examples from your experience.',
    }));

    const overallScore = Math.round(
      evaluatedAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / evaluatedAnswers.length
    );

    setEvaluationResults(
      overallScore,
      ['Strong technical knowledge', 'Clear communication', 'Good problem-solving approach'],
      ['Could provide more specific examples', 'Consider discussing trade-offs'],
      evaluatedAnswers
    );

    setIsEvaluating(false);
    navigate('/results');
  };

  if (state.isEvaluating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analyzing Your Responses
          </h2>
          <p className="text-muted-foreground">
            Our AI is evaluating your interview performance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {state.currentQuestionIndex + 1} of {state.questions.length}
            </span>
            <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full accent-gradient transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Card */}
          <div className="question-card animate-slide-in-right">
            <div className="flex items-center gap-2 mb-4">
              <span className="skill-badge skill-badge-neutral">{currentQuestion?.skill}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
              {currentQuestion?.text}
            </h2>

            {/* Transcript Display */}
            {currentTranscript && (
              <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Your response:</p>
                <p className="text-foreground">{currentTranscript}</p>
              </div>
            )}
          </div>

          {/* Video Recorder */}
          <div className="space-y-6">
            <VideoRecorder
              isRecording={isRecording}
              onTranscript={handleTranscript}
              className="h-[300px] lg:h-[350px]"
            />

            {/* Recording Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isRecording && !hasAnswered ? (
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleStartRecording}
                  className="flex-1"
                >
                  <Circle className="w-5 h-5 mr-2 fill-current" />
                  Start Recording
                </Button>
              ) : isRecording ? (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleStopRecording}
                  className="flex-1"
                >
                  <Square className="w-5 h-5 mr-2 fill-current" />
                  Stop Recording
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="lg"
                  disabled
                  className="flex-1"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Answer Recorded
                </Button>
              )}

              <Button
                variant="default"
                size="lg"
                onClick={handleNextQuestion}
                disabled={!hasAnswered}
                className="flex-1"
              >
                {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Instructions */}
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Speak clearly and take your time. You can re-record your answer if needed before moving to the next question.
              </p>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground mb-4">Question Progress</p>
          <div className="flex flex-wrap gap-2">
            {state.questions.map((q, index) => {
              const isAnswered = state.answers.some(a => a.questionId === q.id);
              const isCurrent = index === state.currentQuestionIndex;

              return (
                <div
                  key={q.id}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    isCurrent
                      ? 'accent-gradient text-accent-foreground'
                      : isAnswered
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isAnswered ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
