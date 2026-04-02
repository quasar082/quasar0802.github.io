'use client';

interface TextRollProps {
  children: string;
  className?: string;
}

export function TextRoll({children, className = ''}: TextRollProps) {
  return (
    <div
      className={className}
      style={{overflow: 'hidden', position: 'relative', height: '1em', lineHeight: 1}}
    >
      <span className="roll-text" style={{display: 'block'}}>
        {children}
      </span>
      <span className="roll-text" style={{display: 'block'}}>
        {children}
      </span>
    </div>
  );
}
