interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const sizes = {
  sm: 'size-8 text-2xs',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
};

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name, size = 'md', interactive = false }: AvatarProps) {
  return (
    <span
      className={`
        grid shrink-0 place-items-center rounded-xl
        bg-gradient-to-br from-brand-400 to-brand-600
        font-display font-extrabold tracking-tight text-white
        ${sizes[size]}
        ${
          interactive
            ? 'ring-2 ring-transparent transition-[box-shadow,transform] duration-150 ease-out-quint group-hover:scale-105 group-hover:ring-brand-200 group-active:scale-95 dark:group-hover:ring-brand-500/40'
            : ''
        }
      `}
    >
      {initialsOf(name)}
    </span>
  );
}
