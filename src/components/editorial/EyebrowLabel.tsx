interface Props {
  number?: string;
  children: React.ReactNode;
  className?: string;
}

export function EyebrowLabel({ number, children, className = "" }: Props) {
  return (
    <span className={`eyebrow inline-flex items-center ${className}`}>
      {number && <span className="eyebrow-num">{number}</span>}
      {children}
    </span>
  );
}
