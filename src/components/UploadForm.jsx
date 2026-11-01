import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { useLang } from '../i18n.jsx';

const IMAGE_EXT = /\.(jpe?g|png|webp|heic)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

function kindOf(file) {
  if (file.type.startsWith('image/') || IMAGE_EXT.test(file.name)) return 'image';
  if (file.type.startsWith('video/') || VIDEO_EXT.test(file.name)) return 'video';
  return null;
}

// Direct browser -> Cloudinary upload with progress (fetch has no upload progress).
function uploadWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}).`)));
    xhr.onerror = () => reject(new Error('Upload failed. Check your connection and try again.'));
    xhr.send(formData);
  });
}

export default function UploadForm({ issueId }) {
  const { t } = useLang();
  const L = t.issue;
  const fileRef = useRef(null);
  const [limits, setLimits] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    api('/media/limits').then(setLimits).catch(() => {});
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setDone(false);
    const file = fileRef.current?.files?.[0];
    const kind = file && kindOf(file);
    if (!kind) {
      setError(L.fileType);
      return;
    }
    setProgress(0);
    try {
      const signed = await api('/media/sign', { method: 'POST', body: { issueId, kind, title, description, size: file.size } });
      const formData = new FormData();
      Object.entries(signed.fields).forEach(([k, v]) => formData.append(k, v));
      formData.append('file', file);
      await uploadWithProgress(signed.uploadUrl, formData, setProgress);
      await api(`/media/${signed.mediaId}/confirm`, { method: 'POST' });
      setDone(true);
      setTitle('');
      setDescription('');
      fileRef.current.value = '';
    } catch (e) {
      setError(e.message);
    } finally {
      setProgress(null);
    }
  }

  const busy = progress !== null;
  return (
    <form className="card static-card upload-form" onSubmit={submit}>
      <h3>{L.shareTitle}</h3>
      <p className="muted">{L.shareIntro}</p>
      {error && <p className="error" role="alert">{error}</p>}
      {done && <p className="success-message" role="status">{L.uploaded}</p>}
      <label>
        {L.file}
        <input ref={fileRef} type="file" required accept="image/*,video/mp4,video/webm,video/quicktime,.heic" disabled={busy} />
        {limits && <small className="muted">{L.fileHelp(limits.imageMb, limits.videoMb)}</small>}
      </label>
      <label>
        {L.titleLabel}
        <input required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} />
      </label>
      <label>
        {L.descLabel}
        <textarea rows="3" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} disabled={busy} />
      </label>
      <button className="primary-btn" type="submit" disabled={busy}>{busy ? L.uploading(progress) : L.submit}</button>
    </form>
  );
}
