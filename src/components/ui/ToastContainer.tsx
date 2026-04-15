import { useToastStore } from '../../store/useToastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`flex items-start gap-3 p-4 min-w-[300px] max-w-md shadow-lg border rounded-sm transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-white/90 border-green-500/50 text-gray-800' :
            toast.type === 'error' ? 'bg-white/90 border-red-500/50 text-gray-800' :
            'bg-white/90 border-gold/50 text-gray-800'
          }`}
        >
          <div className="mt-0.5">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-gold" />}
          </div>
          
          <div className="flex-1 text-sm font-medium">
            {toast.message}
          </div>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}