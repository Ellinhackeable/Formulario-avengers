import { useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const BORDER = "#E0E0E0";
const BLACK = "#0A0A0A";
const GRAY = "#888";

export default function FotosUpload({ fotos, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    if (fotos.length + files.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} fotos.`);
      return;
    }
    const tooBig = files.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setError(`"${tooBig.name}" supera el límite de 10MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const blob = await uploadPresigned(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploaded.push({ name: file.name, url: blob.url });
      }
      onChange([...fotos, ...uploaded]);
    } catch (err) {
      setError(`Error al subir una o más fotos: ${err.message || "intenta de nuevo."}`);
    }
    setUploading(false);
  };

  const remove = (url) => onChange(fotos.filter((f) => f.url !== url));

  return (
    <div>
      {fotos.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          {fotos.map((f) => (
            <div key={f.url} style={{ position: "relative", width: 84, height: 84 }}>
              <img
                src={f.url}
                alt={f.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: `1.5px solid ${BORDER}` }}
              />
              <button
                type="button"
                onClick={() => remove(f.url)}
                style={{
                  position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%",
                  background: BLACK, color: "white", border: "none", cursor: "pointer", fontSize: 11, lineHeight: "20px",
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {fotos.length < MAX_FILES && (
        <label style={{
          display: "inline-block", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          border: `1.5px dashed ${BORDER}`, cursor: uploading ? "not-allowed" : "pointer", color: uploading ? GRAY : BLACK,
        }}>
          {uploading ? "Subiendo..." : "+ Agregar fotos"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={handleFiles}
            style={{ display: "none" }}
          />
        </label>
      )}

      <p style={{ fontSize: 11, color: GRAY, margin: "6px 0 0 0" }}>Hasta {MAX_FILES} fotos, 10MB c/u.</p>

      {error && <p style={{ color: "#c00", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
