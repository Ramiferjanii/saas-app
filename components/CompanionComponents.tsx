"use client";

import { useEffect, useRef, useState } from "react";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";
import { addToSessionHistory } from "@/lib/actions/companion.actions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    if (!vapi) return;

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      addToSessionHistory(companionId);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: any) => {
      console.error("VAPI Error Details:", error);
      console.error("Error type:", error?.type);
      console.error("Error stage:", error?.stage);
      console.error("Error context:", error?.context);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      setCallStatus(CallStatus.INACTIVE);
      
      // Show user-friendly error message
      if (error?.error?.message) {
        alert(`Voice call error: ${error.error.message}`);
      } else if (error?.message) {
        alert(`Voice call error: ${error.message}`);
      } else {
        alert(`Voice call failed. Error type: ${error?.type || 'unknown'}\n\nCheck browser console for details.`);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      if (vapi) {
        vapi.off("call-start", onCallStart);
        vapi.off("call-end", onCallEnd);
        vapi.off("message", onMessage);
        vapi.off("error", onError);
        vapi.off("speech-start", onSpeechStart);
        vapi.off("speech-end", onSpeechEnd);
      }
    };
  }, [vapi]);

  const toggleMicrophone = () => {
    if (!vapi) return;
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    if (!vapi) {
      console.error("VAPI is not initialized. Please check your VAPI token.");
      alert("Voice AI is not available. Please check your VAPI configuration.\n\nTo fix this:\n1. Go to https://vapi.ai\n2. Sign up/login to your account\n3. Get your Web Token from the dashboard\n4. Add it to your .env.local file as NEXT_PUBLIC_VAPI_WEB_TOKEN");
      return;
    }
    
    try {
      setCallStatus(CallStatus.CONNECTING);

      const assistantConfig = configureAssistant(voice, style);
      console.log("Starting VAPI call with config:", assistantConfig);

      const assistantOverrides = {
        variableValues: { subject, topic, style },
        clientMessages: "transcript" as const,
      };

      await vapi.start(assistantConfig, assistantOverrides);
    } catch (error) {
      console.error("Failed to start VAPI call:", error);
      setCallStatus(CallStatus.INACTIVE);
      
      // More specific error messages
      const errorMessage = (error as any)?.error?.message || (error as any)?.message || '';
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
        alert("❌ VAPI Authentication Failed\n\nYour VAPI token is invalid or expired.\n\nTo fix this:\n1. Go to https://vapi.ai\n2. Sign up/login to your account\n3. Get a new Web Token from the dashboard\n4. Update your .env.local file\n5. Restart your development server");
      } else if (errorMessage.includes('400')) {
        alert("❌ VAPI Configuration Error\n\nThere's an issue with your VAPI configuration.\n\nCommon fixes:\n1. Check your VAPI token is valid\n2. Ensure you have sufficient credits\n3. Verify your voice IDs are correct\n4. Check the browser console for more details");
      } else {
        alert("❌ Voice Call Failed\n\nPlease check your VAPI configuration.\n\nTo get help:\n1. Check the browser console for details\n2. Visit https://docs.vapi.ai for documentation\n3. Ensure your VAPI account is active");
      }
    }
  };

  const handleDisconnect = () => {
    if (!vapi) return;
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? "opacity-1001"
                  : "opacity-0",
                callStatus === CallStatus.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            {userImage && userImage.trim() !== "" ? (
              <Image
                src={userImage}
                alt={userName}
                width={130}
                height={130}
                className="rounded-lg"
                onError={(e) => {
                  console.log("Image failed to load:", userImage);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-[130px] h-[130px] bg-gray-300 rounded-lg flex items-center justify-center ${userImage && userImage.trim() !== "" ? 'hidden' : ''}`}>
              <span className="text-2xl font-bold text-gray-600">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="font-bold text-2xl">{userName}</p>
          </div>
          <button
            className="btn-mic"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>
          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting"
              : "Start Session"}
          </button>
        </div>
      </section>

      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replace("/[.,]/g, ", "")}:{" "}
                  {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName}: {message.content}
                </p>
              );
            }
          })}
        </div>

        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default CompanionComponent;
