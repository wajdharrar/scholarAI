import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFileAlt,
  faUpload,
  faRobot,
  faPaperPlane,
  faVolumeUp,
  faStop,
  faSpinner,
  faLightbulb,
  faSearch,
  faCheckCircle,
  faTimes,
  faChevronDown,
  faChevronUp,
  faBookOpen,
  faMicrophoneAlt,
  faVolumeOff,
} from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Component({
  selector: 'app-paper-assistant',
  templateUrl: './paper-assistant.component.html',
  styleUrls: ['./paper-assistant.component.css'],
})
export class PaperAssistantComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Icons
  faFileAlt = faFileAlt;
  faUpload = faUpload;
  faRobot = faRobot;
  faPaperPlane = faPaperPlane;
  faVolumeUp = faVolumeUp;
  faStop = faStop;
  faSpinner = faSpinner;
  faLightbulb = faLightbulb;
  faSearch = faSearch;
  faCheckCircle = faCheckCircle;
  faTimes = faTimes;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faBookOpen = faBookOpen;
  faMicrophoneAlt = faMicrophoneAlt;
  faVolumeOff = faVolumeOff;

  // ── Config ──────────────────────────────────────────────
  // Replace with your actual Groq API key (or load from environment)
  private readonly GROQ_API_KEY = '*****************************************************';
  private readonly GROQ_MODEL = 'llama-3.3-70b-versatile';
  private readonly GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

  // ── State ────────────────────────────────────────────────
  paperText = '';
  paperTitle = '';
  paperFileName = '';
  isDragOver = false;
  isLoadingPaper = false;
  isPaperLoaded = false;
  isProcessing = false;
  userQuestion = '';
  messages: Message[] = [];
  showSummary = false;
  summaryText = '';
  isSummarizing = false;
  isSpeaking = false;
  currentSpeechUtterance: SpeechSynthesisUtterance | null = null;
  showSuggestedQuestions = true;
  activeTab: 'chat' | 'summary' = 'chat';

  suggestedQuestions = [
    'What is the main contribution of this paper?',
    'What methodology did the authors use?',
    'What are the key findings and conclusions?',
    'What are the limitations of this study?',
    'How does this compare to related work?',
  ];

  private conversationHistory: GroqMessage[] = [];
  private speechSynthesis: SpeechSynthesis | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  ngOnDestroy(): void {
    this.stopSpeaking();
  }

  // ── File Handling ────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.loadFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.loadFile(file);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  private async loadFile(file: File): Promise<void> {
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      alert('Please upload a PDF or TXT file.');
      return;
    }

    this.isLoadingPaper = true;
    this.paperFileName = file.name;
    this.paperTitle = file.name.replace(/\.(pdf|txt)$/i, '');

    try {
      if (file.name.endsWith('.txt')) {
        this.paperText = await file.text();
      } else {
        this.paperText = await this.extractPdfText(file);
      }

      this.isPaperLoaded = true;
      this.messages = [];
      this.conversationHistory = [];
      this.summaryText = '';
      this.showSummary = false;
      this.activeTab = 'chat';

      this.addSystemContext();
    } catch (err) {
      console.error('Error loading file:', err);
      alert('Failed to load the file. Please try again.');
    } finally {
      this.isLoadingPaper = false;
    }
  }

  private async extractPdfText(file: File): Promise<string> {
    // Load PDF.js from CDN
    const pdfjsLib = await this.loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  }

  private loadPdfJs(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private addSystemContext(): void {
    const truncatedText = this.paperText.slice(0, 12000);
    this.conversationHistory = [
      {
        role: 'system',
        content: `You are a helpful research assistant. The user has uploaded a research paper. 
          Answer questions about it clearly and accurately. Use evidence from the paper to support your answers.
          Here is the paper content:\n\n${truncatedText}`,
      },
    ];
  }

  removePaper(): void {
    this.isPaperLoaded = false;
    this.paperText = '';
    this.paperTitle = '';
    this.paperFileName = '';
    this.messages = [];
    this.conversationHistory = [];
    this.summaryText = '';
    this.stopSpeaking();
  }

  // ── Chat ─────────────────────────────────────────────────
  async sendMessage(questionOverride?: string): Promise<void> {
    const question = questionOverride || this.userQuestion.trim();
    if (!question || this.isProcessing || !this.isPaperLoaded) return;

    this.userQuestion = '';
    this.showSuggestedQuestions = false;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    this.messages.push(userMsg);
    this.conversationHistory.push({ role: 'user', content: question });

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    this.messages.push(assistantMsg);
    this.isProcessing = true;

    setTimeout(() => this.scrollToBottom(), 50);

    try {
      const response = await fetch(this.GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.GROQ_MODEL,
          messages: this.conversationHistory,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            fullContent += delta;
            assistantMsg.content = fullContent;
            this.scrollToBottom();
          } catch {}
        }
      }

      assistantMsg.isStreaming = false;
      this.conversationHistory.push({ role: 'assistant', content: fullContent });
    } catch (err) {
      console.error('Groq error:', err);
      assistantMsg.content =
        'Sorry, I encountered an error. Please check your API key and try again.';
      assistantMsg.isStreaming = false;
    } finally {
      this.isProcessing = false;
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // ── Summary ──────────────────────────────────────────────
  async generateSummary(): Promise<void> {
    if (this.isSummarizing || !this.isPaperLoaded) return;
    this.activeTab = 'summary';
    if (this.summaryText) return;

    this.isSummarizing = true;
    this.summaryText = '';

    try {
      const truncated = this.paperText.slice(0, 12000);
      const response = await fetch(this.GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.GROQ_MODEL,
          messages: [
            {
              role: 'user',
              content: `Please provide a comprehensive summary of this research paper in the following structure:

                **Overview**: A 2-3 sentence high-level summary
                **Problem**: What problem does this paper address?
                **Methodology**: What approach/methods did the authors use?
                **Key Findings**: The main results and discoveries
                **Contributions**: What new knowledge does this add to the field?
                **Limitations**: Any noted limitations or future work

                Paper content:
                ${truncated}`,
            },
          ],
          max_tokens: 1200,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error(`Groq error: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            this.summaryText += parsed.choices?.[0]?.delta?.content || '';
          } catch {}
        }
      }
    } catch (err) {
      console.error('Summary error:', err);
      this.summaryText = 'Failed to generate summary. Please try again.';
    } finally {
      this.isSummarizing = false;
    }
  }

  // ── Text-to-Speech (Web Speech API — free, built-in) ─────
  speakText(text: string): void {
    if (!this.speechSynthesis) return;
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    // Function to set a good voice
    const setVoice = () => {
        const voices = this.speechSynthesis!.getVoices();
        if (voices.length === 0) return;

        // Priority 1: Look for a clear, modern English voice
        let selectedVoice = voices.find(voice => 
            (voice.lang === 'en-US' || voice.lang === 'en-GB') && 
            (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha'))
        );
        
        // Priority 2: If none found, just pick any English (US) voice
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === 'en-US');
        }
        
        // Priority 3: Last resort, use the first available English voice
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        this.speechSynthesis!.speak(utterance);
    };

    // Voices might load asynchronously
    if (this.speechSynthesis.getVoices().length > 0) {
        setVoice();
    } else {
        this.speechSynthesis.onvoiceschanged = setVoice;
    }

    utterance.onend = () => (this.isSpeaking = false);
    utterance.onerror = () => (this.isSpeaking = false);

    this.currentSpeechUtterance = utterance;
    this.isSpeaking = true;
  }
  stopSpeaking(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  speakSummary(): void {
    if (this.isSpeaking) {
      this.stopSpeaking();
    } else {
      this.speakText(this.summaryText.replace(/\*\*/g, ''));
    }
  }

  speakMessage(content: string): void {
    if (this.isSpeaking) {
      this.stopSpeaking();
    } else {
      this.speakText(content);
    }
  }

  // ── Utilities ─────────────────────────────────────────────
  private scrollToBottom(): void {
    try {
      const el = this.chatContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }

  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  trackByMessage(_: number, msg: Message): string {
    return msg.id;
  }
}