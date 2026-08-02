import { useMemo, useRef, useState } from 'react';
import { useClickOutside } from '../../lib/useClickOutside';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

/**
 * `new Date('2004-05-17')` is parsed as UTC and can shift a day backwards in
 * negative offsets, so ISO strings are split manually and built in local time.
 */
function parseISO(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toISO(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatLong(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

interface DatePickerProps {
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function DatePicker({
  label,
  value,
  error,
  placeholder = 'Pilih tanggal',
  onChange,
}: DatePickerProps) {
  const selected = parseISO(value);
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getFullYear();

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected ?? new Date(today.getFullYear() - 20, 0, 1));
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);
  
  const years = useMemo(
    () => Array.from({ length: 100 }, (_, index) => currentYear - index),
    [currentYear]);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const leadingBlanks = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: leadingBlanks }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [viewDate]);

  function shiftMonth(offset: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function pick(date: Date) {
    onChange(toISO(date));
    setOpen(false);
  }

  return (
    <div className="space-y-1.5">
      <span className="block text-2xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`
            flex h-11 w-full items-center gap-2.5 rounded-xl border bg-surface pl-3.5 pr-3 text-left text-sm
            transition-[border-color,box-shadow] duration-150 ease-out-quint
            hover:border-line-strong focus:outline-none focus:ring-4
            ${
              error
                ? 'border-critical focus:border-critical focus:ring-critical/15'
                : 'border-line focus:border-brand-500 focus:ring-brand-500/15'
            }
          `}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-4 shrink-0 text-ink-faint"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>

          <span className={`flex-1 truncate ${selected ? 'text-ink' : 'text-ink-faint'}`}>
            {selected ? formatLong(selected) : placeholder}
          </span>

          {selected && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Hapus tanggal"
              onClick={(event) => {
                event.stopPropagation();
                onChange('');
              }}
              className="grid size-6 shrink-0 place-items-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-sunken hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
          )}
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Pilih tanggal"
            className="absolute left-0 top-full z-50 mt-2 w-72 origin-top animate-rise rounded-2xl border border-line bg-surface p-3 shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <NavButton label="Bulan sebelumnya" onClick={() => shiftMonth(-1)}>
                <path d="m15 18-6-6 6-6" />
              </NavButton>

              {/* Month and year are dropdowns rather than arrow-only navigation:
                  reaching a birth year 25 clicks back is not navigation. */}
              <select
                value={viewDate.getMonth()}
                onChange={(event) =>
                  setViewDate(new Date(viewDate.getFullYear(), Number(event.target.value), 1))
                }
                aria-label="Bulan"
                className="h-8 flex-1 cursor-pointer appearance-none rounded-lg bg-transparent px-2 text-center text-xs font-semibold text-ink transition-colors duration-150 hover:bg-sunken focus:outline-none"
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={viewDate.getFullYear()}
                onChange={(event) =>
                  setViewDate(new Date(Number(event.target.value), viewDate.getMonth(), 1))
                }
                aria-label="Tahun"
                className="h-8 w-18 cursor-pointer appearance-none rounded-lg bg-transparent px-2 text-center text-xs font-semibold text-ink transition-colors duration-150 hover:bg-sunken focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <NavButton label="Bulan berikutnya" onClick={() => shiftMonth(1)}>
                <path d="m9 18 6-6-6-6" />
              </NavButton>
            </div>

            <div className="mt-2 grid grid-cols-7 gap-0.5">
              {WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className="grid h-7 place-items-center text-[10px] font-semibold uppercase text-ink-faint"
                >
                  {weekday[0]}
                </span>
              ))}

              {days.map((date, index) => {
                if (!date) return <span key={`blank-${index}`} />;

                const isSelected = selected ? toISO(date) === toISO(selected) : false;
                const isToday = toISO(date) === toISO(today);
                const isFuture = date > today;

                return (
                  <button
                    key={toISO(date)}
                    type="button"
                    disabled={isFuture}
                    onClick={() => pick(date)}
                    aria-current={isSelected ? 'date' : undefined}
                    className={`
                      grid h-8 place-items-center rounded-lg text-xs font-medium tabular
                      transition-[background-color,color,transform] duration-100 ease-out-quint
                      active:scale-90
                      disabled:cursor-not-allowed disabled:text-ink-faint/30
                      ${
                        isSelected
                          ? 'bg-brand-500 font-bold text-white shadow-brand'
                          : isToday
                            ? 'bg-sunken font-bold text-brand-500'
                            : 'text-ink-soft hover:bg-sunken hover:text-ink'
                      }
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <p className="animate-fade-in text-2xs font-medium text-critical">{error}</p>}
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-soft transition-[background-color,color,transform] duration-150 hover:bg-sunken hover:text-brand-500 active:scale-90"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
