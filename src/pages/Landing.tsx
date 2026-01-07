import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Briefcase, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import { useInterview } from '@/contexts/InterviewContext';
import heroBg from '@/assets/hero-bg.jpg';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const {
    state,
    setResumeFile,
    setJobDescriptionFile,
    setAnalysisResults,
    setIsAnalyzing,
  } = useInterview();

  const canAnalyze = state.resumeFile && state.jobDescriptionFile && !state.isAnalyzing;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (uploadSectionRef.current) {
      observer.observe(uploadSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);

    // Simulate analysis (in real app, this would call the AI API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock results
    const matchedSkills = [
      { name: 'React', category: 'Frontend', matched: true },
      { name: 'TypeScript', category: 'Languages', matched: true },
      { name: 'Node.js', category: 'Backend', matched: true },
      { name: 'REST APIs', category: 'Backend', matched: true },
      { name: 'Git', category: 'Tools', matched: true },
      { name: 'Agile', category: 'Methodology', matched: true },
      { name: 'CSS/Tailwind', category: 'Frontend', matched: true },
      { name: 'Testing', category: 'Quality', matched: true },
    ];

    const missingSkills = [
      { name: 'GraphQL', category: 'Backend', matched: false },
      { name: 'AWS', category: 'Cloud', matched: false },
      { name: 'Docker', category: 'DevOps', matched: false },
    ];

    const percentage = Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100);

    setAnalysisResults(matchedSkills, missingSkills, percentage);
    setIsAnalyzing(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-300" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-white/90">AI-Powered Interview Assistant</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Master Your Next
            <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Interview
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 animate-slide-up delay-100 max-w-2xl mx-auto">
            Get instant skill matching, personalized questions, and AI-powered feedback to help you succeed.
          </p>

          <Button
            variant="hero"
            size="xl"
            onClick={scrollToUpload}
            className="animate-slide-up delay-200"
          >
            Get Started
            <ArrowDown className="w-5 h-5 ml-2 animate-bounce" />
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section
        ref={uploadSectionRef}
        className="py-24 px-4 bg-background glow-effect"
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Documents
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              We'll analyze your resume against the job description to identify skill matches and prepare tailored interview questions.
            </p>
          </div>

          <div
            className={`grid md:grid-cols-2 gap-6 mb-12 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <FileUpload
              label="Upload Resume"
              description="PDF or DOCX, max 10MB"
              accept=".pdf,.docx,.doc"
              onFileSelect={setResumeFile}
              selectedFile={state.resumeFile}
              icon={<FileText className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors" />}
            />
            <FileUpload
              label="Upload Job Description"
              description="PDF, DOCX, or paste text"
              accept=".pdf,.docx,.doc,.txt"
              onFileSelect={setJobDescriptionFile}
              selectedFile={state.jobDescriptionFile}
              icon={<Briefcase className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors" />}
            />
          </div>

          <div
            className={`text-center transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Button
              variant="hero"
              size="xl"
              disabled={!canAnalyze}
              onClick={handleAnalyze}
              className="min-w-[200px]"
            >
              {state.isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Match
                </>
              )}
            </Button>
            {!canAnalyze && !state.isAnalyzing && (
              <p className="text-sm text-muted-foreground mt-4">
                Please upload both documents to continue
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Skill Matching',
                description: 'Instantly see how your skills align with job requirements',
              },
              {
                icon: '💡',
                title: 'Smart Questions',
                description: 'AI-generated questions tailored to your experience',
              },
              {
                icon: '📊',
                title: 'Detailed Feedback',
                description: 'Get actionable insights to improve your performance',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
