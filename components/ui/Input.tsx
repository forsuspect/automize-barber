"use client";

import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className={`${styles.group} ${error ? styles.error : ""}`}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`${styles.input} ${className ?? ""}`}
        {...props}
      />
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name;
  return (
    <div className={`${styles.group} ${error ? styles.error : ""}`}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={`${styles.textarea} ${className ?? ""}`}
        {...props}
      />
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const inputId = id ?? props.name;
  return (
    <div className={`${styles.group} ${error ? styles.error : ""}`}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        className={`${styles.select} ${className ?? ""}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </div>
  );
}
