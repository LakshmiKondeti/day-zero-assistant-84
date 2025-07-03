
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  dashboardData: any;
  employeeName: string;
  criticalCount: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ dashboardData, employeeName, criticalCount }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognitionAPI();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or use text input.",
          variant: "destructive"
        });
      };
    }

    // Initialize speech synthesis
    synthesis.current = window.speechSynthesis;

    // Add initial greeting with comprehensive dashboard overview
    const nextMeeting = dashboardData.teamseMeetings[0];
    const approvalCount = dashboardData.approvalRequests.pending;
    const mandatoryTraining = dashboardData.learning.filter((l: any) => l.mandatory && l.deadline === 'Today').length;
    const urgentMails = dashboardData.outlookMails.urgent;
    const totalMails = dashboardData.outlookMails.escalated.length;
    const serviceNowTickets = dashboardData.serviceNowTickets.length;
    const escalatedTickets = dashboardData.serviceNowTickets.filter((t: any) => t.escalated).length;

    const initialMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Hello ${employeeName}! I'm PAL, your Personal Assistant Lite. Here's your dashboard overview: Your next Teams meeting is "${nextMeeting.title}" at ${nextMeeting.time}. You have ${approvalCount} approval requests pending, ${mandatoryTraining} mandatory trainings due today, ${urgentMails} urgent emails with ${totalMails} total escalated messages, and ${serviceNowTickets} ServiceNow tickets with ${escalatedTickets} escalated ones. You have ${criticalCount} critical items requiring immediate attention. How can I assist you today?`,
      timestamp: new Date()
    };
    setMessages([initialMessage]);

    if (isVoiceEnabled) {
      speakText(initialMessage.content);
    }
  }, []);

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthesis.current && isVoiceEnabled) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthesis.current.speak(utterance);
    }
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('critical') || input.includes('urgent')) {
      const criticalIncidents = dashboardData.incidents.filter((i: any) => i.severity === 'Critical').length;
      const urgentMeetings = dashboardData.teamseMeetings.filter((m: any) => m.urgent).length;
      const urgentApprovals = dashboardData.approvalRequests.urgent.length;
      
      return `You have ${criticalIncidents} critical incidents, ${urgentMeetings} urgent meetings, and ${urgentApprovals} urgent approvals requiring immediate attention.`;
    }
    
    if (input.includes('meeting') || input.includes('teams')) {
      const nextMeeting = dashboardData.teamseMeetings[0];
      return `Your next meeting is "${nextMeeting.title}" at ${nextMeeting.time} with ${nextMeeting.attendees} attendees in the ${nextMeeting.channel} channel.`;
    }
    
    if (input.includes('email') || input.includes('mail')) {
      return `You have ${dashboardData.outlookMails.urgent} urgent emails, with ${dashboardData.outlookMails.escalated.length} escalated messages requiring immediate attention.`;
    }
    
    if (input.includes('approval')) {
      return `You have ${dashboardData.approvalRequests.pending} pending approvals, with ${dashboardData.approvalRequests.urgent.length} urgent requests. The oldest request is ${dashboardData.approvalRequests.urgent[0]?.days} days old.`;
    }
    
    if (input.includes('incident')) {
      const criticalIncidents = dashboardData.incidents.filter((i: any) => i.severity === 'Critical');
      if (criticalIncidents.length > 0) {
        return `There are ${criticalIncidents.length} critical incidents. The most severe is "${criticalIncidents[0].title}" affecting ${criticalIncidents[0].impact}.`;
      }
      return `You have ${dashboardData.incidents.length} total incidents being tracked.`;
    }
    
    if (input.includes('training') || input.includes('learning')) {
      const dueTodayCount = dashboardData.learning.filter((l: any) => l.deadline === 'Today').length;
      return `You have ${dashboardData.learning.length} learning items, with ${dueTodayCount} mandatory courses due today.`;
    }
    
    if (input.includes('ticket') || input.includes('servicenow')) {
      const escalatedCount = dashboardData.serviceNowTickets.filter((t: any) => t.escalated).length;
      return `You have ${dashboardData.serviceNowTickets.length} ServiceNow tickets, with ${escalatedCount} escalated tickets requiring attention.`;
    }
    
    if (input.includes('overview') || input.includes('summary')) {
      const nextMeeting = dashboardData.teamseMeetings[0];
      const approvalCount = dashboardData.approvalRequests.pending;
      const mandatoryTraining = dashboardData.learning.filter((l: any) => l.mandatory && l.deadline === 'Today').length;
      const urgentMails = dashboardData.outlookMails.urgent;
      const serviceNowTickets = dashboardData.serviceNowTickets.length;
      const escalatedTickets = dashboardData.serviceNowTickets.filter((t: any) => t.escalated).length;
      
      return `Here's your complete dashboard overview: Next Teams meeting is "${nextMeeting.title}" at ${nextMeeting.time}. You have ${approvalCount} approval requests, ${mandatoryTraining} mandatory trainings due today, ${urgentMails} urgent emails, ${serviceNowTickets} ServiceNow tickets with ${escalatedTickets} escalated ones, and ${criticalCount} total critical items.`;
    }
    
    return `I'm PAL, your Personal Assistant Lite. I can help you with information about your meetings, emails, approvals, incidents, training, and ServiceNow tickets. What would you like to know more about?`;
  };

  const handleUserInput = (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    const response = generateResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    
    if (isVoiceEnabled) {
      speakText(response);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleUserInput(textInput);
      setTextInput('');
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (synthesis.current && isSpeaking) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="mb-6 border-2 border-red-500 shadow-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-red-600 to-black text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <span>PAL - Personal Assistant Lite</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white">
              {criticalCount} Critical Items
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className="text-white hover:bg-white/20"
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {/* Voice Controls */}
        <div className="flex items-center space-x-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop Listening' : 'Voice Input'}</span>
          </Button>
          
          {isSpeaking && (
            <Badge variant="secondary" className="bg-red-100 text-red-800 animate-pulse border-red-300">
              Speaking...
            </Badge>
          )}
          
          {isListening && (
            <Badge variant="secondary" className="bg-black text-white animate-pulse">
              Listening...
            </Badge>
          )}
        </div>

        {/* Text Input */}
        <div className="flex space-x-2">
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Pal do you need to know anything?"
            className="flex-1 border-red-300 focus:border-red-500 focus:ring-red-500"
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
          />
          <Button
            variant="default"
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Conversation History - Now Scrollable */}
        <ScrollArea className="h-48 w-full rounded-md border-2 border-red-200 bg-gray-50 p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
