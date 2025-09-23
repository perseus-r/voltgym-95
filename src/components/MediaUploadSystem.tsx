import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Camera, Video, Mic, Image as ImageIcon, Upload, X, Play, Pause,
  Zap, Brain, Hash, MapPin, Edit3, Wand2, Sparkles, CheckCircle
} from "lucide-react";

interface MediaFile {
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'audio';
  id: string;
  aiDescription?: string;
  aiTags?: string[];
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

interface MediaUploadSystemProps {
  onMediaUploaded?: (urls: string[]) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video' | 'audio')[];
}

export function MediaUploadSystem({ 
  onMediaUploaded, 
  maxFiles = 4, 
  allowedTypes = ['image', 'video', 'audio'] 
}: MediaUploadSystemProps) {
  const { user } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'video' | 'audio'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getFileType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // fallback
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (mediaFiles.length >= maxFiles) {
        toast.warning(`Máximo de ${maxFiles} arquivos permitidos`);
        break;
      }

      const fileType = getFileType(file);
      if (!allowedTypes.includes(fileType)) {
        toast.error(`Tipo de arquivo não permitido: ${file.type}`);
        continue;
      }

      const preview = await createPreview(file);
      const mediaFile: MediaFile = {
        file,
        preview,
        type: fileType,
        id: generateId(),
        processingStatus: 'pending'
      };

      setMediaFiles(prev => [...prev, mediaFile]);
      
      // Simular processamento de IA
      await simulateAIProcessing(mediaFile);
    }
  };

  const simulateAIProcessing = async (mediaFile: MediaFile) => {
    // Atualizar status para processando
    setMediaFiles(prev => prev.map(m => 
      m.id === mediaFile.id 
        ? { ...m, processingStatus: 'processing' }
        : m
    ));

    // Simular processamento com delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Gerar descrição e tags de IA baseado no tipo
    let aiDescription = '';
    let aiTags: string[] = [];

    switch (mediaFile.type) {
      case 'image':
        aiDescription = 'Atleta realizando exercício com boa forma técnica em ambiente de academia';
        aiTags = ['treino', 'forma', 'academia', 'foco'];
        break;
      case 'video':
        aiDescription = 'Demonstração de exercício com movimento controlado e respiração adequada';
        aiTags = ['movimento', 'técnica', 'demonstração', 'educativo'];
        break;
      case 'audio':
        aiDescription = 'Áudio motivacional com instruções claras para execução do exercício';
        aiTags = ['motivação', 'instrução', 'coaching', 'mindset'];
        break;
    }

    // Atualizar com dados da IA
    setMediaFiles(prev => prev.map(m => 
      m.id === mediaFile.id 
        ? { 
            ...m, 
            processingStatus: 'completed',
            aiDescription,
            aiTags
          }
        : m
    ));

    toast.success('🤖 IA analisou a mídia e adicionou descrição automática!');
  };

  const startRecording = async (type: 'video' | 'audio') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
        const file = new File([blob], `recording.${type === 'video' ? 'webm' : 'wav'}`, { type: blob.type });
        
        const preview = URL.createObjectURL(blob);
        const mediaFile: MediaFile = {
          file,
          preview,
          type: type === 'video' ? 'video' : 'audio',
          id: generateId(),
          processingStatus: 'pending'
        };

        setMediaFiles(prev => [...prev, mediaFile]);
        await simulateAIProcessing(mediaFile);
        
        // Limpar stream
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      
      toast.success(`🎥 Gravação de ${type === 'video' ? 'vídeo' : 'áudio'} iniciada`);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Erro ao iniciar gravação');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Gravação finalizada');
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
  };

  const uploadMedia = async () => {
    if (!user || mediaFiles.length === 0) return;

    try {
      setUploading(true);
      setProgress(0);
      
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < mediaFiles.length; i++) {
        const mediaFile = mediaFiles[i];
        
        // Simular upload (substitua por upload real para Supabase Storage)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Registrar no banco de dados
        const { data, error } = await supabase
          .from('media_uploads')
          .insert([{
            user_id: user.id,
            file_name: mediaFile.file.name,
            file_type: mediaFile.type,
            file_size: mediaFile.file.size,
            storage_path: `uploads/${user.id}/${mediaFile.id}`,
            public_url: mediaFile.preview, // URL temporária
            processing_status: 'completed',
            ai_description: mediaFile.aiDescription,
            ai_tags: mediaFile.aiTags
          }])
          .select()
          .single();

        if (error) throw error;
        
        uploadedUrls.push(data.public_url);
        setProgress(((i + 1) / mediaFiles.length) * 100);
      }

      onMediaUploaded?.(uploadedUrls);
      setMediaFiles([]);
      toast.success('🎉 Mídia enviada com sucesso!');
      
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Erro ao enviar mídia');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Controls */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-accent/20">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-txt">📸 Upload Inteligente</h3>
            <p className="text-sm text-txt-2">IA analisa automaticamente suas fotos e vídeos</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {allowedTypes.includes('image') && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="liquid-glass-button p-4 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <ImageIcon className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-sm text-txt">Fotos</div>
            </button>
          )}
          
          {allowedTypes.includes('video') && (
            <button
              onClick={() => isRecording ? stopRecording() : startRecording('video')}
              className={`liquid-glass-button p-4 rounded-lg transition-colors ${
                isRecording && recordingType === 'video' 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'hover:bg-accent/10'
              }`}
            >
              {isRecording && recordingType === 'video' ? (
                <>
                  <div className="w-6 h-6 bg-red-500 rounded mx-auto mb-2 animate-pulse" />
                  <div className="text-sm text-red-400">Gravando</div>
                </>
              ) : (
                <>
                  <Video className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-sm text-txt">Vídeo</div>
                </>
              )}
            </button>
          )}
          
          {allowedTypes.includes('audio') && (
            <button
              onClick={() => isRecording ? stopRecording() : startRecording('audio')}
              className={`liquid-glass-button p-4 rounded-lg transition-colors ${
                isRecording && recordingType === 'audio' 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'hover:bg-accent/10'
              }`}
            >
              {isRecording && recordingType === 'audio' ? (
                <>
                  <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2 animate-pulse" />
                  <div className="text-sm text-red-400">Gravando</div>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-sm text-txt">Áudio</div>
                </>
              )}
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.map(type => {
            switch (type) {
              case 'image': return 'image/*';
              case 'video': return 'video/*';
              case 'audio': return 'audio/*';
              default: return '';
            }
          }).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-xs text-txt-3 text-center">
          Máximo {maxFiles} arquivos • IA analisa automaticamente
        </div>
      </div>

      {/* Media Preview */}
      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          {mediaFiles.map((mediaFile) => (
            <div key={mediaFile.id} className="liquid-glass p-4 rounded-lg">
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                  {mediaFile.type === 'image' && (
                    <img 
                      src={mediaFile.preview} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {mediaFile.type === 'video' && (
                    <div className="w-full h-full bg-surface flex items-center justify-center">
                      <Play className="w-6 h-6 text-accent" />
                    </div>
                  )}
                  {mediaFile.type === 'audio' && (
                    <div className="w-full h-full bg-surface flex items-center justify-center">
                      <Mic className="w-6 h-6 text-accent" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-txt">{mediaFile.file.name}</span>
                    <Badge className={`text-xs ${
                      mediaFile.processingStatus === 'completed' ? 'bg-green-500/20 text-green-400' :
                      mediaFile.processingStatus === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {mediaFile.processingStatus === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {mediaFile.processingStatus === 'processing' && <Brain className="w-3 h-3 mr-1 animate-pulse" />}
                      {mediaFile.processingStatus === 'completed' ? 'Analisado' :
                       mediaFile.processingStatus === 'processing' ? 'Analisando...' : 'Pendente'}
                    </Badge>
                  </div>

                  {/* AI Description */}
                  {mediaFile.aiDescription && (
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Brain className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent">IA Detectou:</span>
                      </div>
                      <p className="text-sm text-txt-2">{mediaFile.aiDescription}</p>
                    </div>
                  )}

                  {/* AI Tags */}
                  {mediaFile.aiTags && mediaFile.aiTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {mediaFile.aiTags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 rounded text-xs bg-accent/10 text-accent"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeMedia(mediaFile.id)}
                  className="liquid-glass-button p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Upload Progress */}
          {uploading && (
            <div className="liquid-glass p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Upload className="w-5 h-5 text-accent animate-bounce" />
                <span className="text-sm font-medium text-txt">Enviando mídia...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-txt-3 mt-1">{Math.round(progress)}% concluído</div>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && mediaFiles.some(m => m.processingStatus === 'completed') && (
            <Button 
              onClick={uploadMedia}
              className="w-full bg-accent hover:bg-accent/90 text-accent-ink"
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Enviar {mediaFiles.length} arquivo{mediaFiles.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}

      {/* AI Features Info */}
      <div className="liquid-glass p-6 text-center">
        <Wand2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-txt mb-2">🤖 IA Analisa Tudo</h3>
        <p className="text-txt-2 mb-4">
          Nossa IA automaticamente identifica exercícios, analisa a forma e sugere melhorias
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <Hash className="w-4 h-4 text-accent mx-auto mb-1" />
            <div className="text-txt-3">Tags automáticas</div>
          </div>
          <div>
            <Brain className="w-4 h-4 text-accent mx-auto mb-1" />
            <div className="text-txt-3">Análise técnica</div>
          </div>
          <div>
            <Sparkles className="w-4 h-4 text-accent mx-auto mb-1" />
            <div className="text-txt-3">Sugestões IA</div>
          </div>
        </div>
      </div>
    </div>
  );
}