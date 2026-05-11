import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, MapPin } from 'lucide-react';

export default function StoryPanel({ selectedPlace, story, onClose, loading }) {
  if (!selectedPlace && !loading) return null;

  return (
    <AnimatePresence>
      {(selectedPlace || loading) && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-4 top-4 bottom-4 w-full max-w-md glass p-8 z-[1000] overflow-y-auto flex flex-col gap-6"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-indigo-400">
              <BookOpen size={20} />
              <span className="text-sm font-semibold tracking-wider uppercase">Crônica do Tempo</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight">
              {selectedPlace?.name || 'Explorando...'}
            </h1>
            <div className="flex items-center gap-4 text-white/50 text-sm">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{selectedPlace?.type || 'História'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Memória Viva</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/40">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-sm animate-pulse">Consultando os registros do tempo...</p>
            </div>
          ) : (
            <div className="space-y-6 text-lg leading-relaxed text-white/90">
              {story ? (
                story.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p>Nenhuma história encontrada para este local ainda.</p>
              )}
            </div>
          )}

          <div className="mt-auto pt-8">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300">
              Esta narrativa foi tecida por uma Inteligência Artificial treinada em história e poesia.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
