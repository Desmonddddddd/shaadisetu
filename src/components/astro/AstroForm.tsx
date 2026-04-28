"use client";

export type PersonForm = {
  name: string;
  gender: "male" | "female" | "other" | "";
  dob: string;
  tob: string;
  place: string;
};

export const emptyPerson: PersonForm = {
  name: "",
  gender: "",
  dob: "",
  tob: "",
  place: "",
};

interface Props {
  value: PersonForm;
  onChange: (v: PersonForm) => void;
  errors?: Partial<Record<keyof PersonForm, string>>;
  legend?: string;
  showGender?: boolean;
  disabled?: boolean;
}

export function AstroForm({
  value,
  onChange,
  errors = {},
  legend,
  showGender = true,
  disabled,
}: Props) {
  function set<K extends keyof PersonForm>(k: K, v: PersonForm[K]) {
    onChange({ ...value, [k]: v });
  }
  return (
    <fieldset disabled={disabled} className="space-y-4 disabled:opacity-60">
      {legend && (
        <legend className="text-[0.62rem] uppercase tracking-[0.24em] text-bordeaux mb-2">
          {legend}
        </legend>
      )}

      <Field label="Name" required error={errors.name}>
        <input
          type="text"
          required
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputCls}
        />
      </Field>

      {showGender && (
        <Field label="Gender" error={errors.gender}>
          <select
            value={value.gender}
            onChange={(e) => set("gender", e.target.value as PersonForm["gender"])}
            className={`${inputCls} appearance-none`}
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Date of birth" required error={errors.dob}>
          <input
            type="date"
            required
            value={value.dob}
            onChange={(e) => set("dob", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Time of birth (24h)" error={errors.tob}>
          <input
            type="time"
            value={value.tob}
            onChange={(e) => set("tob", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Place of birth" required error={errors.place}>
        <input
          type="text"
          required
          value={value.place}
          onChange={(e) => set("place", e.target.value)}
          placeholder="e.g. Delhi, India"
          className={inputCls}
        />
      </Field>
    </fieldset>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-ink/20 px-0 py-2 text-sm text-ink focus:outline-none focus:border-bordeaux transition-colors";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mb-1">
        {label}
        {required && <span className="text-bordeaux ml-1">*</span>}
      </span>
      {children}
      {error && (
        <span className="block text-xs text-bordeaux mt-1">{error}</span>
      )}
    </label>
  );
}
