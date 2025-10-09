import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (voice: string, style: string) => {
  // Normalize voice parameter to lowercase
  const normalizedVoice = voice?.toLowerCase() || "female";
  const normalizedStyle = style?.toLowerCase() || "casual";
  
  const voiceId =
    voices[normalizedVoice as keyof typeof voices]?.[
      normalizedStyle as keyof (typeof voices)[keyof typeof voices]
    ] || voices.female.casual; // Default fallback

  console.log("VAPI Configuration:", {
    voice: normalizedVoice,
    style: normalizedStyle,
    voiceId,
  });

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage: "Hello! I'm your AI tutor. Let's start learning about {{topic}} today.",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable AI tutor. Teach the student about the topic: {{topic}} in the subject: {{subject}}. 
          
          Guidelines:
          - Keep responses conversational and under 2 sentences
          - Ask questions to check understanding
          - Use a {{style}} teaching style
          - Focus on the specific topic: {{topic}}
          - Be encouraging and supportive`,
        },
      ],
    },
    clientMessages: "transcript",
  };
  
  return vapiAssistant;
};
