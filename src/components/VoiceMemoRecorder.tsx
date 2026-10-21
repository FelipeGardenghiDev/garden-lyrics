import React, { useState, useRef } from 'react';
import { VoiceMemo } from '../types';
import { Mic, Square, Trash2 } from 'lucide-react';

export const VoiceMemoRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [memos, setMemos] = useState<VoiceMemo[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);

        const newMemo: VoiceMemo = {
          id: `memo-${Date.now()}`,
          name: `Ideia de Voz #${memos.length + 1}`,
          audioBlobUrl: audioUrl,
          durationSec,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMemos((prev) => [newMemo, ...prev]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Não foi possível acessar o microfone para gravar memo de voz.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 shadow-2xl backdrop-blur flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
          🎙️ Gravador de Memos Vocais
        </span>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-3.5 h-3.5" /> Parar Gravação
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" /> Gravar Melodia
            </>
          )}
        </button>
      </div>

      {memos.length === 0 ? (
        <div className="text-[11px] text-zinc-500 text-center py-2">
          Grave ideias cantadas para não esquecer o ritmo e a melodia do verso.
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-200">{memo.name}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {memo.durationSec}s • {memo.timestamp}
                </span>
              </div>

              <audio src={memo.audioBlobUrl} controls className="h-7 w-44 max-w-full" />

              <button
                onClick={() => setMemos((prev) => prev.filter((m) => m.id !== memo.id))}
                className="p-1 text-zinc-600 hover:text-rose-400"
                title="Excluir memo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
