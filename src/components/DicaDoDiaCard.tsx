import React from 'react';
import { DicaDeOuro } from './DicaDeOuro';

interface Props {
  onBonusPoints?: (points: number) => void;
}

/**
 * Backwards compatibility wrapper for DicaDeOuro
 */
export const DicaDoDiaCard: React.FC<Props> = (props) => {
  return <DicaDeOuro {...props} />;
};

export { DicaDeOuro };
