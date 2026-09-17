import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Text } from "./Text";
import { getInputFieldClasses } from "./inputFieldStyles";
import { Modal } from "./Modal";

// Formats a Date object as YYYY-MM-DD (the format the backend's date
// fields expect) using local date parts — not toISOString(), which shifts
// the date across timezone boundaries near midnight.
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateString(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

// Converts a stored YYYY-MM-DD value into the DD/MM/YYYY text shown in
// the text input while the user isn't actively typing over it.
function toTypedFormat(value: string | undefined): string {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

// Parses a DD/MM/YYYY typed string back into YYYY-MM-DD, validating
// that the date is real (not just numerically in range — e.g. rejects
// 31/02/2026). Returns undefined for anything incomplete or invalid.
function parseTypedFormat(typed: string): string | undefined {
  const match = typed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? `${yearStr}-${monthStr}-${dayStr}` : undefined;
}

// Auto-inserts "/" separators as the user types digits, and blocks
// anything past 8 digits (DDMMYYYY) — mirrors the digit-cleaning
// pattern used in OtpInput rather than relying on an input mask library.
function autoFormatTyping(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
};

// Builds a 6-row grid (42 cells) covering the visible month plus the
// leading/trailing days needed to fill complete weeks — the standard
// shape for a month-grid calendar.
function buildCalendarGrid(monthAnchor: Date): CalendarDay[] {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return { date, isCurrentMonth: date.getMonth() === month };
  });
}

// Builds a 12-year block for the year picker, anchored so the given
// year falls within it (not necessarily at the start) — keeps the
// currently-shown year visible when first opening the picker rather
// than always starting the block at a round decade boundary.
function buildYearGrid(anchorYear: number): number[] {
  const blockStart = anchorYear - (anchorYear % 12);
  return Array.from({ length: 12 }, (_, index) => blockStart + index);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type DateFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
};

// Web-only implementation (Expo's native branch, which wrapped
// @expo/ui's Jetpack Compose/SwiftUI date pickers, has no web
// equivalent and is dropped entirely) — a typed DD/MM/YYYY text field
// plus a calendar icon that opens a custom calendar in a Modal. A raw
// <input type="date"> was avoided because it renders in the browser's
// locale format, which can't be overridden to match this app's
// DD/MM/YYYY convention.
export function DateField({
  label,
  value,
  onChange,
  placeholder = "Any",
}: DateFieldProps) {
  const [typedValue, setTypedValue] = useState(() => toTypedFormat(value));
  const [isFocused, setIsFocused] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    () => parseDateString(value) ?? new Date(),
  );
  // "days" shows the month grid; "years" shows a 12-year picker for
  // jumping several years at once, since paging month-by-month to go
  // back a couple of years takes far too many taps.
  const [calendarView, setCalendarView] = useState<"days" | "years">("days");

  // Keep the typed text in sync when `value` changes from outside
  // (calendar selection, or the parent resetting the field) — but not
  // while the field is focused, so a mid-typing rerender from a
  // debounced onChange upstream doesn't fight the user's keystrokes.
  useEffect(() => {
    if (!isFocused) {
      setTypedValue(toTypedFormat(value));
    }
  }, [value, isFocused]);

  function handleTypedChange(text: string) {
    const formatted = autoFormatTyping(text);
    setTypedValue(formatted);

    const parsed = parseTypedFormat(formatted);
    if (parsed) {
      onChange(parsed);
      setCalendarMonth(parseDateString(parsed) ?? new Date());
    } else if (formatted.length === 0) {
      onChange(undefined);
    }
  }

  function handleBlur() {
    setIsFocused(false);
    // Revert to the last valid value's formatting if what's left typed
    // doesn't parse — avoids leaving a half-typed "15/03/" behind.
    setTypedValue(toTypedFormat(value));
  }

  function openCalendar() {
    setCalendarMonth(parseDateString(value) ?? new Date());
    setCalendarView("days");
    setCalendarOpen(true);
  }

  function handleSelectDay(date: Date) {
    const dateString = toDateString(date);
    onChange(dateString);
    setTypedValue(toTypedFormat(dateString));
    setCalendarOpen(false);
  }

  function handleSelectYear(year: number) {
    setCalendarMonth(new Date(year, calendarMonth.getMonth(), 1));
    setCalendarView("days");
  }

  const grid = useMemo(() => buildCalendarGrid(calendarMonth), [calendarMonth]);
  const yearGrid = useMemo(
    () => buildYearGrid(calendarMonth.getFullYear()),
    [calendarMonth],
  );
  const selectedDate = parseDateString(value);
  const today = new Date();

  return (
    <div className="flex-1 flex flex-col gap-1">
      <Text variant="body-sm" className="text-muted-foreground pl-1">
        {label}
      </Text>

      <div className="relative flex items-center">
        <input
          value={typedValue}
          onChange={(e) => handleTypedChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder === "Any" ? "DD/MM/YYYY" : placeholder}
          inputMode="numeric"
          className={getInputFieldClasses({
            state: "default",
            className: "w-full pr-11",
          })}
        />

        <button
          type="button"
          onClick={openCalendar}
          className="absolute right-3 p-1 cursor-pointer"
        >
          <CalendarDays size={18} className="text-muted-foreground" />
        </button>
      </div>

      <Modal
        visible={calendarOpen}
        dismissible
        onDismiss={() => setCalendarOpen(false)}
        className="max-w-[320px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (calendarView === "days") {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() - 1,
                      1,
                    ),
                  );
                } else {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear() - 12,
                      calendarMonth.getMonth(),
                      1,
                    ),
                  );
                }
              }}
              className="h-8 w-8 flex items-center justify-center rounded-md active:bg-secondary cursor-pointer"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>

            <button
              type="button"
              onClick={() =>
                setCalendarView((prev) => (prev === "days" ? "years" : "days"))
              }
              className="rounded-md px-2 py-1 active:bg-secondary cursor-pointer"
            >
              <Text variant="body-sm" className="font-semibold">
                {calendarView === "days"
                  ? `${MONTH_LABELS[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`
                  : `${yearGrid[0]} – ${yearGrid[yearGrid.length - 1]}`}
              </Text>
            </button>

            <button
              type="button"
              onClick={() => {
                if (calendarView === "days") {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear(),
                      calendarMonth.getMonth() + 1,
                      1,
                    ),
                  );
                } else {
                  setCalendarMonth(
                    new Date(
                      calendarMonth.getFullYear() + 12,
                      calendarMonth.getMonth(),
                      1,
                    ),
                  );
                }
              }}
              className="h-8 w-8 flex items-center justify-center rounded-md active:bg-secondary cursor-pointer"
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
          </div>

          {calendarView === "years" ? (
            <div className="flex flex-row flex-wrap">
              {yearGrid.map((year) => {
                const isSelectedYear = selectedDate?.getFullYear() === year;
                const isCurrentYear = today.getFullYear() === year;

                return (
                  <button
                    type="button"
                    key={year}
                    onClick={() => handleSelectYear(year)}
                    className="w-1/3 flex items-center justify-center py-3 cursor-pointer"
                  >
                    <span
                      className={
                        isSelectedYear
                          ? "h-9 w-16 flex items-center justify-center rounded-full bg-primary"
                          : "h-9 w-16 flex items-center justify-center rounded-full active:bg-secondary"
                      }
                    >
                      <Text
                        variant="body-sm"
                        className={
                          isSelectedYear
                            ? "text-primary-foreground"
                            : isCurrentYear
                              ? "text-primary font-semibold"
                              : "text-foreground"
                        }
                      >
                        {year}
                      </Text>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex flex-row">
                {WEEKDAY_LABELS.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 flex items-center justify-center py-1"
                  >
                    <Text variant="caption" className="text-muted-foreground">
                      {day}
                    </Text>
                  </div>
                ))}
              </div>

              {Array.from({ length: 6 }, (_, week) => (
                <div key={week} className="flex flex-row">
                  {grid
                    .slice(week * 7, week * 7 + 7)
                    .map(({ date, isCurrentMonth }) => {
                      const isSelected =
                        selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, today);

                      return (
                        <button
                          type="button"
                          key={date.toISOString()}
                          onClick={() => handleSelectDay(date)}
                          className="flex-1 aspect-square flex items-center justify-center cursor-pointer"
                        >
                          <span
                            className={
                              isSelected
                                ? "h-8 w-8 flex items-center justify-center rounded-full bg-primary"
                                : "h-8 w-8 flex items-center justify-center rounded-full active:bg-secondary"
                            }
                          >
                            <Text
                              variant="body-sm"
                              className={
                                isSelected
                                  ? "text-primary-foreground"
                                  : !isCurrentMonth
                                    ? "text-muted-foreground/40"
                                    : isToday
                                      ? "text-primary font-semibold"
                                      : "text-foreground"
                              }
                            >
                              {date.getDate()}
                            </Text>
                          </span>
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
