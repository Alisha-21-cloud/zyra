import Vapi from "@vapi-ai/web";
import { error } from "console";
import { useEffect, useState } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    //only for testing the vapi API, otherwise customers will provide their own API Keys
    const vapiInstance = new Vapi("585a7b4f-f9fd-4926-8c6f-1288b8f5e353")
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
        setIsConnected(true);
        setIsConnecting(false);
        setTranscript([]);
    })

    vapiInstance.on("call-end", () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
    })

    vapiInstance.on("speech-start", () => {
        setIsSpeaking(true);
    })

    vapiInstance.on("speech-end", () => {
        setIsSpeaking(false);
    })

    vapiInstance.on("error", (error) => {
        console.log(error, "VAPI_ERROR");
        setIsConnecting(false);
    })

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev, {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });

    return () => {
        vapiInstance?.stop();
    }
  }, []);

  const startCall = () => {
    setIsConnecting(true);

    if(vapi){
        vapi.start("d0e67451-987e-49c3-b961-a12733857dc3")
    }
  }

  const endCall = () => {
    if(vapi){
        vapi.stop();
    }
  }

  return {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  }
};