import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressRing from '@/components/ProgressRing';
import SkillBadge from '@/components/SkillBadge';
import { useInterview } from '@/contexts/InterviewContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    setQuestions,
    setIsGeneratingQuestions,
  } = useInterview();

  const handleStartInterview = async () => {
    setIsGeneratingQuestions(true);

    // Simulate question generation (in real app, this would call the AI API)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock questions based on matched skills
    const questions = [
      { id: 1, text: 'Can you explain the difference between React state and props? Give an example of when you would use each.', skill: 'React' },
      { id: 2, text: 'How do you handle type safety in a large TypeScript project? What strategies do you use to avoid "any" types?', skill: 'TypeScript' },
      { id: 3, text: 'Describe a RESTful API you designed. What endpoints did it have and how did you handle authentication?', skill: 'REST APIs' },
      { id: 4, text: 'How do you approach testing React components? What testing libraries have you used?', skill: 'Testing' },
      { id: 5, text: 'Explain your Git workflow. How do you handle merge conflicts and code reviews?', skill: 'Git' },
      { id: 6, text: 'How do you structure CSS in a large application? What are the benefits of Tailwind CSS?', skill: 'CSS/Tailwind' },
      { id: 7, text: 'Describe your experience with Node.js. What kind of backend services have you built?', skill: 'Node.js' },
      { id: 8, text: 'How do you implement Agile practices in your development process? Give a specific example.', skill: 'Agile' },
      { id: 9, text: 'How do you optimize React application performance? What tools do you use to identify bottlenecks?', skill: 'React' },
      { id: 10, text: 'Describe a challenging bug you encountered and how you debugged it.', skill: 'Problem Solving' },
    ];

    setQuestions(questions);
    setIsGeneratingQuestions(false);
    navigate('/interview');
  };

  const groupedSkills = state.matchedSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof state.matchedSkills>);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Skills Analysis
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's how your skills match the job requirements
          </p>
        </div>

        {/* Match Score Card */}
        <div className="glass-card-elevated rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ProgressRing
              progress={state.matchPercentage}
              size={160}
              strokeWidth={12}
              color={state.matchPercentage >= 70 ? 'success' : state.matchPercentage >= 50 ? 'warning' : 'accent'}
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {state.matchPercentage >= 70
                  ? 'Excellent Match!'
                  : state.matchPercentage >= 50
                  ? 'Good Match'
                  : 'Partial Match'}
              </h2>
              <p className="text-muted-foreground mb-4">
                You match {state.matchedSkills.length} out of {state.matchedSkills.length + state.missingSkills.length} required skills
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{state.matchedSkills.length} Matched</span>
                </div>
                <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{state.missingSkills.length} Missing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Matched Skills */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Matched Skills
            </h3>
            <div className="space-y-4">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-sm text-muted-foreground mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <SkillBadge key={skill.name} skill={skill.name} matched={true} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="glass-card rounded-2xl p-6 animate-slide-up delay-100">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Skills to Develop
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.missingSkills.map(skill => (
                <SkillBadge key={skill.name} skill={skill.name} matched={false} />
              ))}
            </div>
            {state.missingSkills.length === 0 && (
              <p className="text-muted-foreground">No missing skills - great job!</p>
            )}
          </div>
        </div>

        {/* Interview Preparation */}
        <div className="glass-card-elevated rounded-2xl p-8 animate-slide-up delay-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Ready for Your Interview?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We've prepared 10 personalized questions based on your matched skills. 
              The interview will be recorded and analyzed to provide detailed feedback.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {state.matchedSkills.slice(0, 6).map(skill => (
                <SkillBadge key={skill.name} skill={skill.name} showIcon={false} />
              ))}
              {state.matchedSkills.length > 6 && (
                <span className="skill-badge skill-badge-neutral">
                  +{state.matchedSkills.length - 6} more
                </span>
              )}
            </div>
            <Button
              variant="hero"
              size="xl"
              onClick={handleStartInterview}
              disabled={state.isGeneratingQuestions}
            >
              {state.isGeneratingQuestions ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparing Questions...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Interview
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
