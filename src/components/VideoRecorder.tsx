import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoRecorderProps {
  isRecording: boolean;
  onTranscript?: (text: string) => void;
  className?: string;
}

// Type definitions for Web Speech API
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
    confidence: number;
  };
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  isRecording,
  onTranscript,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsCameraOn(true);
      setIsMicOn(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsMicOn(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Speech recognition setup
  useEffect(() => {
    const windowWithSpeech = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };

    const SpeechRecognitionConstructor = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    
    if (SpeechRecognitionConstructor) {
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  useEffect(() => {
    if (recognitionRef.current) {
      if (isRecording) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started
        }
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording]);

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  return (
    <div className={cn('video-container', className)}>
      {hasPermission === false ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <VideoOff className="w-12 h-12 mb-4" />
          <p className="text-center px-4">
            Camera access denied. Please enable camera permissions to continue.
          </p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1.5 rounded-full">
              <div className="recording-indicator" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={toggleCamera}
              className={cn(
                'p-3 rounded-full transition-colors',
                isCameraOn
                  ? 'bg-muted/80 text-foreground hover:bg-muted'
                  : 'bg-destructive/80 text-destructive-foreground hover:bg-destructive'
              )}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMic}
              className={cn(
                'p-3 rounded-full transition-colors',
                isMicOn
                  ? 'bg-muted/80 text-foreground hover:bg-muted'
                  : 'bg-destructive/80 text-destructive-foreground hover:bg-destructive'
              )}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoRecorder;
