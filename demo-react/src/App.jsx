import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tools = [
  { name: 'n8n-MCP', tag: 'MCP', color: '#8b5cf6' },
  { name: 'claude-mem', tag: 'Plugin', color: '#f97316' },
  { name: 'UI UX Pro Max', tag: 'Skill', color: '#06b6d4' },
  { name: 'Everything Claude Code', tag: 'Plugin', color: '#10b981' },
  { name: 'framer-motion', tag: 'NPM', color: '#ec4899' },
];

export default function App() {
  const [active, setActive] = useState(null);

  return (
    <main className="page">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        5 herramientas gratis para Claude
      </motion.h1>

      <ul className="grid">
        {tools.map((t, i) => (
          <motion.li
            key={t.name}
            layoutId={t.name}
            onClick={() => setActive(t)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            style={{ borderColor: t.color }}
          >
            <span className="tag" style={{ background: t.color }}>{t.tag}</span>
            <strong>{t.name}</strong>
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={active.name}
              className="card"
              style={{ borderColor: active.color }}
            >
              <span className="tag" style={{ background: active.color }}>{active.tag}</span>
              <h2>{active.name}</h2>
              <p>Animado con <code>layoutId</code> de framer-motion. Click fuera para cerrar.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
