import React, { useState } from 'react';
import { UploadCloud, Image, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const FileUpload = ({ label = 'Upload Photo / Document', onFileSelect, accept = 'image/*', multiple = false }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    const updated = multiple ? [...previews, ...newPreviews] : newPreviews;
    setPreviews(updated);
    if (onFileSelect) onFileSelect(multiple ? updated.map((p) => p.file) : files[0]);
  };

  const removeFile = (index) => {
    const updated = previews.filter((_, idx) => idx !== index);
    setPreviews(updated);
    if (onFileSelect) onFileSelect(multiple ? updated.map((p) => p.file) : null);
  };

  return (
    <div className="w-full space-y-3">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">{label}</label>}

      <div className="relative border-2 border-dashed border-slate-700 hover:border-brand-500/60 rounded-2xl p-6 text-center transition-colors bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer group">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-200">
            Click to upload <span className="text-slate-400 font-normal">or drag and drop</span>
          </p>
          <p className="text-xs text-slate-400">PNG, JPG, WEBP, or PDF up to 10MB</p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {previews.map((item, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-2 flex items-center gap-3">
              {item.file.type.startsWith('image/') ? (
                <img src={item.url} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
              ) : (
                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-lg text-slate-400">
                  <Image className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-500">{(item.file.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                onClick={() => removeFile(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
