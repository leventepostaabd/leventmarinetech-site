'use client';
import { useState, useRef } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export type UploadedFile = {
  path: string;
  name: string;
  size: number;
  contentType: string;
};

/**
 * Drag-drop + click photo/file uploader to Supabase Storage (`attachments` bucket).
 * Falls back gracefully if SUPABASE keys are missing (silent client error, user keeps wizard).
 */
export default function PhotoUpload({
  prefix = 'web',
  onChange,
  hint
}: {
  prefix?: string;
  onChange: (files: UploadedFile[]) => void;
  hint?: string;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File) {
    const supabase = createBrowserSupabase();
    const safeName = file.name.replace(/[^\w.\-]/g, '_');
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { error } = await supabase.storage.from('attachments').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false
    });
    if (error) throw error;
    return { path, name: file.name, size: file.size, contentType: file.type };
  }

  async function handleFiles(list: FileList | File[]) {
    setErr(null);
    const arr = Array.from(list).slice(0, 5 - files.length);
    if (!arr.length) return;
    setBusy(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const f of arr) {
        if (f.size > 8 * 1024 * 1024) {
          setErr(`${f.name}: max 8 MB`);
          continue;
        }
        uploaded.push(await uploadOne(f));
      }
      const next = [...files, ...uploaded];
      setFiles(next);
      onChange(next);
    } catch (e: any) {
      setErr(e?.message || 'Upload failed. WhatsApp the photo to +1 619 384 0403 with your reference number when we send it.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function remove(path: string) {
    const next = files.filter((f) => f.path !== path);
    setFiles(next);
    onChange(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        className={`relative cursor-pointer rounded-md border-2 border-dashed transition px-5 py-6 text-center ${busy ? 'border-amber bg-amber/5' : 'border-line-strong bg-navy-50 hover:border-amber'}`}
      >
        <svg className="mx-auto mb-2 text-ink-subtle" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <div className="text-[14px] font-medium text-ink">{busy ? 'Uploading…' : 'Drop nameplate photo or click to choose'}</div>
        <div className="text-[12px] text-ink-subtle mt-1">{hint ?? 'JPG / PNG / HEIC / PDF · up to 5 files · 8 MB each'}</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {err && <div className="mt-2 text-[12.5px] font-mono text-red-600">{err}</div>}
      {files.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {files.map((f) => (
            <li key={f.path} className="flex items-center justify-between gap-3 px-3 py-2 bg-white border border-line rounded-md text-[13px]">
              <span className="flex items-center gap-2 min-w-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="truncate text-ink">{f.name}</span>
                <span className="font-mono text-[11px] text-ink-subtle shrink-0">{Math.round(f.size / 1024)} KB</span>
              </span>
              <button type="button" onClick={() => remove(f.path)} aria-label="Remove" className="text-ink-subtle hover:text-red-600 text-[12px] font-mono">remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
