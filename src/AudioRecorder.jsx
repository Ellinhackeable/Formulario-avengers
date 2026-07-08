import { useRef, useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const BORDER = "#E0E0E0";
const BLACK = "#0A0A0A";
const GRAY = "#888";
const YELLOW = "#E9FF7B";

function extensionFor(mimeType) {
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "m4a";
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mpeg")) return "mp3";
  return "webm";
}

// Safari/iOS reports mimeTypes like "audio/mp4;codecs=mp4a.40.2" — Blob
// content-type allowlists match on the base type only, so strip params.
function baseMimeType(mimeType) {
  return mimeType.split(";")[0].trim();
}

export default function AudioRecorder({ audio, onChange }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        uploadRecording(blob);
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      setError("No se pudo acceder al micrófono. Revisa los permisos del navegador.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadRecording = async (blob) => {
    if (blob.size > MAX_SIZE) {
      setError("La grabación supera el límite de 10MB.");
      return;
    }
    setUploading(true);
    try {
      const ext = extensionFor(blob.type);
      const result = await uploadPresigned(`audio-presentacion-${crypto.randomUUID()}.${ext}`, blob, {
        access: "public",
        contentType: baseMimeType(blob.type),
        handleUploadUrl: "/api/upload",
      });
      onChange({ url: result.url });
    } catch (err) {
      setError(`Error al subir el audio: ${err.message || "intenta de nuevo."}`);
    }
    setUploading(false);
  };

  const remove = () => onChange(null);

  if (audio) {
    return (
      <div>
        <audio controls src={audio.url} style={{ width: "100%", marginBottom: 8 }} />
        <button
          type="button"
          onClick={remove}
          style={{
            background: "white", border: `1.5px solid ${BORDER}`, padding: "8px 16px",
            borderRadius: 8, fontSize: 13, cursor: "pointer", color: GRAY,
          }}
        >Grabar de nuevo</button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        disabled={uploading}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: recording ? "#c00" : YELLOW, color: recording ? "white" : BLACK, border: "none",
          padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700,
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        <span>{recording ? "■" : "🎙"}</span>
        {uploading ? "Subiendo..." : recording ? "Detener grabación" : "Grabar audio"}
      </button>

      {error && <p style={{ color: "#c00", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
