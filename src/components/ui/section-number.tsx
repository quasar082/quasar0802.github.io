interface SectionNumberProps {
  number: string;
}

export function SectionNumber({ number }: SectionNumberProps) {
  return (
    <span className="font-mono text-sm uppercase tracking-widest text-text-muted">
      {number}
    </span>
  );
}
