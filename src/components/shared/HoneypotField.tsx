"use client";

import { HONEYPOT_FIELD } from "@/lib/requestGuards";

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * A decoy input. No human sees it, so anything that arrives filled came from a
 * bot walking the DOM — the server then answers as though the submission
 * worked and quietly discards it.
 *
 * Positioned off-screen rather than `type="hidden"` or `display: none`: the
 * cruder bots skip fields they can tell are hidden, and this needs to look
 * like an ordinary text input to them. `aria-hidden` and `tabIndex={-1}` keep
 * it away from screen readers and keyboard users.
 *
 * Keeping browsers *out* of it matters more than keeping bots in, because a
 * filled honeypot discards the enquiry. `autocomplete="off"` alone is not
 * enough — browsers openly ignore it for profile autofill — so the real
 * defence is the field name (see `HONEYPOT_FIELD`), backed by the documented
 * opt-outs for the two most common password managers.
 */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field blank</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore
        data-form-type="other"
      />
    </div>
  );
}
