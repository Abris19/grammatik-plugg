import { motion } from 'framer-motion';
import { WORD_CLASS_COLORS } from '../data/grammar';
import type { WordClass } from '../data/grammar';

interface Token {
  text: string;
  wordClass?: WordClass;
  isTarget?: boolean;
}

interface Props {
  tokens: Token[];
  showColors?: boolean;
}

export function SentenceCard({ tokens, showColors = false }: Props) {
  return (
    <p className="text-lg md:text-xl font-medium leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1 justify-center">
      {tokens.map((token, i) => {
        const color = token.wordClass ? WORD_CLASS_COLORS[token.wordClass] : undefined;
        return (
          <motion.span
            key={i}
            className="inline-block"
            style={
              token.isTarget
                ? {
                    textDecoration: 'underline',
                    textDecorationStyle: 'wavy',
                    textDecorationColor: '#7C3AED',
                    textUnderlineOffset: '4px',
                    fontWeight: 700,
                    color: showColors && color ? color : undefined,
                  }
                : showColors && color
                ? { color }
                : undefined
            }
          >
            {token.text}
          </motion.span>
        );
      })}
    </p>
  );
}
