import { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import worldCountries from "world-countries";

import { getInputFieldClasses } from "./inputFieldStyles";
import { Text } from "./Text";
import { Divider } from "./Divider";
import { Modal } from "./Modal";

type Country = {
  name: string;
  cca2: string;
  flag: string;
  callingCode: string;
};

// For most countries idd.root + idd.suffixes[0] is the calling code.
// But a handful of countries share a root that's already a complete,
// standalone calling code, where the "suffixes" list is really just
// regional/area-code numbering, not part of the country code itself —
// most notably root "+1" (NANP: US, Canada, Dominican Republic, Puerto
// Rico, and ~20 Caribbean nations, whose suffixes are area codes like
// "201" for New Jersey) and root "+7" (Russia/Kazakhstan). Appending
// idd.suffixes[0] there would produce garbage like "+1201" for the US.
// Verified against the actual world-countries data: this split correctly
// resolves every case checked (US/Canada -> +1, Vatican -> +3906698,
// Åland -> +35818, Western Sahara -> +2125288, Norway -> +47).
const SHARED_STANDALONE_ROOTS = new Set(["1", "7"]);

// world-countries lists each further-subdivided nation only once per
// entry (not once per suffix) — collapse is not needed, but multiple
// countries can still resolve to the same final calling code (see
// SHARED_STANDALONE_ROOTS above), which is handled at lookup time below.
const ALL_COUNTRIES: Country[] = worldCountries
  .filter((country) => country.idd?.root)
  .map((country) => {
    const root = country.idd.root.replace("+", "");
    const suffixes = country.idd.suffixes ?? [];

    const callingCode =
      suffixes.length === 0 || SHARED_STANDALONE_ROOTS.has(root)
        ? root
        : `${root}${suffixes[0]}`;

    return {
      name: country.name.common,
      cca2: country.cca2,
      flag: country.flag,
      callingCode,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// Multiple countries can share the same calling code (+1 covers the US,
// Canada, and a dozen Caribbean nations). Auto-detection below only fires
// on an unambiguous match, so this intentionally keeps just the first
// country seen per code — good enough for a lookup table, not used to
// decide ambiguous matches.
const COUNTRY_BY_CALLING_CODE = new Map<string, Country>();
for (const country of ALL_COUNTRIES) {
  if (!COUNTRY_BY_CALLING_CODE.has(country.callingCode)) {
    COUNTRY_BY_CALLING_CODE.set(country.callingCode, country);
  }
}

// How many countries share this exact calling code — used to decide
// whether typing it is enough to auto-select (only when unambiguous).
const CALLING_CODE_COUNTS = ALL_COUNTRIES.reduce<Record<string, number>>(
  (acc, country) => {
    acc[country.callingCode] = (acc[country.callingCode] ?? 0) + 1;
    return acc;
  },
  {},
);

const ALL_CALLING_CODES = [...COUNTRY_BY_CALLING_CODE.keys()];

// Codes that are themselves a *prefix* of some other, longer calling
// code — e.g. "39" (Italy) is a prefix of "3906698" (Vatican City), and
// "47" (Norway) is a prefix of "4779" (Svalbard and Jan Mayen). A handful
// of dependent territories share their parent country's code with an
// extended suffix like this. If we auto-jumped the instant "39" matched
// Italy exactly, a user typing toward "3906698" for Vatican City would
// get yanked to the number field after the 2nd digit and never get the
// chance to finish. So codes in this set are excluded from auto-jump —
// the user finishes typing, then explicitly moves on (blur/next field)
// or opens the picker to disambiguate.
const CODES_WITH_LONGER_MATCH = new Set(
  ALL_CALLING_CODES.filter((code) =>
    ALL_CALLING_CODES.some((other) => other !== code && other.startsWith(code)),
  ),
);

const DEFAULT_COUNTRY = COUNTRY_BY_CALLING_CODE.get("91") ?? ALL_COUNTRIES[0];

type PhoneNumberInputProps = {
  onChangeFullNumber: (fullNumber: string) => void;
  // A full "+<callingCode><localNumber>" string (e.g. "+919876543210")
  // to pre-fill the field with — used when editing an existing record
  // that already has a phone number, since this component otherwise
  // always starts from the default country with an empty number.
  initialValue?: string;
};

// Calling codes aren't a fixed length (most are 1-3 digits, but a
// handful of dependent territories like Vatican City's "+3906698" run
// to 7) — so parsing "+<code><number>" back apart means trying the
// longest known code first and working down, not guessing a fixed
// split point. Returns the default country/empty state if nothing
// matches or no value was given.
function parseInitialValue(value: string | undefined): {
  country: Country;
  codeDigits: string;
  localNumber: string;
} {
  const fallback = {
    country: DEFAULT_COUNTRY,
    codeDigits: DEFAULT_COUNTRY.callingCode,
    localNumber: "",
  };

  if (!value) {
    return fallback;
  }

  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) {
    return fallback;
  }

  const sortedCodes = [...ALL_CALLING_CODES].sort(
    (a, b) => b.length - a.length,
  );
  const matchedCode = sortedCodes.find((code) => digitsOnly.startsWith(code));

  if (!matchedCode) {
    return fallback;
  }

  const country = COUNTRY_BY_CALLING_CODE.get(matchedCode) ?? DEFAULT_COUNTRY;

  return {
    country,
    codeDigits: matchedCode,
    localNumber: digitsOnly.slice(matchedCode.length),
  };
}

export function PhoneNumberInput({
  onChangeFullNumber,
  initialValue,
}: PhoneNumberInputProps) {
  const [initialParsed] = useState(() => parseInitialValue(initialValue));
  const [country, setCountry] = useState<Country>(initialParsed.country);
  const [codeDigits, setCodeDigits] = useState(initialParsed.codeDigits);
  const [localNumber, setLocalNumber] = useState(initialParsed.localNumber);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  const numberInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  function emitChange(callingCode: string, number: string) {
    onChangeFullNumber(number ? `+${callingCode}${number}` : "");
  }

  function handleCodeChange(text: string) {
    const digits = text.replace(/\D/g, "");
    setCodeDigits(digits);

    // Only auto-select and jump ahead on an exact, unambiguous match:
    // unique to one country (not shared like +1) AND not itself a
    // prefix of some longer valid code (not like +39 vs +3906698).
    const match = COUNTRY_BY_CALLING_CODE.get(digits);
    const isUnambiguous =
      match &&
      CALLING_CODE_COUNTS[digits] === 1 &&
      !CODES_WITH_LONGER_MATCH.has(digits);

    if (isUnambiguous) {
      setCountry(match);
      emitChange(digits, localNumber);
      numberInputRef.current?.focus();
      return;
    }

    emitChange(digits, localNumber);
  }

  // When the code field loses focus (user tabbed to the number field,
  // or clicked elsewhere) without an auto-jump having fired — e.g. they
  // typed "1" and moved on manually, or typed "39" and clicked away
  // rather than continuing toward "3906698" — resolve whatever exact
  // match exists now so the flag/country shown isn't left stale.
  function handleCodeBlur() {
    setIsCodeFocused(false);
    const match = COUNTRY_BY_CALLING_CODE.get(codeDigits);
    if (match && match.cca2 !== country.cca2) {
      setCountry(match);
    }
  }

  function handleNumberChange(text: string) {
    const digits = text.replace(/\D/g, "");
    setLocalNumber(digits);
    emitChange(codeDigits, digits);
  }

  // Backspacing out of an empty number field returns focus to the code
  // field, mirroring how a single continuous field would behave.
  function handleNumberKeyDown(key: string) {
    if (key === "Backspace" && localNumber.length === 0) {
      codeInputRef.current?.focus();
    }
  }

  function handleSelectCountry(selected: Country) {
    setCountry(selected);
    setCodeDigits(selected.callingCode);
    emitChange(selected.callingCode, localNumber);
    setIsPickerOpen(false);
    setSearchQuery("");
    numberInputRef.current?.focus();
  }

  function openPicker() {
    setSearchQuery("");
    setIsPickerOpen(true);
  }

  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_COUNTRIES;

    return ALL_COUNTRIES.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.callingCode.includes(query),
    );
  }, [searchQuery]);

  const isFocused = isCodeFocused || isNumberFocused;
  const fieldState = isFocused ? "focused" : "default";

  return (
    <div className="w-full">
      <div
        className={getInputFieldClasses({
          state: fieldState,
          className: "w-full flex flex-row items-center px-0",
        })}
      >
        <button
          type="button"
          onClick={openPicker}
          className="pl-4 pr-2 cursor-pointer"
        >
          <Text variant="body">{country.flag}</Text>
        </button>

        <input
          ref={codeInputRef}
          value={`+${codeDigits}`}
          onChange={(e) => handleCodeChange(e.target.value.replace("+", ""))}
          onFocus={() => setIsCodeFocused(true)}
          onBlur={handleCodeBlur}
          inputMode="tel"
          className="w-16 h-full bg-transparent text-foreground border-0 outline-none placeholder:text-muted-foreground"
        />

        <Divider orientation="vertical" className="my-3" />

        <input
          ref={numberInputRef}
          value={localNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          onKeyDown={(e) => handleNumberKeyDown(e.key)}
          onFocus={() => setIsNumberFocused(true)}
          onBlur={() => setIsNumberFocused(false)}
          placeholder="Phone number"
          inputMode="tel"
          className="flex-1 h-full pl-3 pr-4 bg-transparent text-foreground border-0 outline-none placeholder:text-muted-foreground"
        />
      </div>

      <Modal
        visible={isPickerOpen}
        dismissible
        onDismiss={() => setIsPickerOpen(false)}
        title="Select country"
        className="max-h-[80%]"
      >
        <div className="flex flex-col gap-3">
          <div className="relative flex items-center">
            <div className="absolute left-3 z-10">
              <Search size={18} className="text-muted-foreground" />
            </div>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or code"
              autoFocus
              className={getInputFieldClasses({
                state: "default",
                className: "w-full pl-10",
              })}
            />
          </div>

          <div
            className="flex flex-col overflow-y-auto"
            style={{ maxHeight: 360 }}
          >
            {filteredCountries.map((item) => (
              <button
                type="button"
                key={item.cca2}
                onClick={() => handleSelectCountry(item)}
                className="flex flex-row items-center gap-3 py-3 cursor-pointer text-left"
              >
                <Text variant="body">{item.flag}</Text>
                <Text variant="body" className="flex-1">
                  {item.name}
                </Text>
                <Text variant="body-sm" className="text-muted-foreground">
                  +{item.callingCode}
                </Text>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
