import { forwardRef } from "react";
const FormInput = forwardRef(function FormInput(
  { label, error, ...inputProps },
  ref,
) {
  return (
    <label className="w-full flex flex-col gap-1 md:flex-row md:items-start md:gap-2">
      <span className="form-label pt-2">{label}</span>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <input
          ref={ref}
          type="text"
          className="flex-1 min-w-0"
          aria-invalid={error ? "true" : undefined}
          {...inputProps}
        />
        {error && (
          <span className="text-sm text-error" role="alert">
            {error}
          </span>
        )}
      </div>
    </label>
  );
});

/**
 * 表單欄位：label + textarea，用於留言等多行輸入。
 * 支援 React Hook Form 的 register（透過 ref）與 error 顯示。
 */
const FormTextarea = forwardRef(function FormTextarea(
  { label, error, ...textareaProps },
  ref,
) {
  return (
    <label className="w-full flex flex-col gap-1 md:flex-row md:items-start md:gap-2">
      <span className="form-label pt-2">{label}</span>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <textarea
          ref={ref}
          rows={3}
          className="flex-1 min-w-0 w-full resize-y"
          aria-invalid={error ? "true" : undefined}
          {...textareaProps}
        />
        {error && (
          <span className="text-sm text-error" role="alert">
            {error}
          </span>
        )}
      </div>
    </label>
  );
});

export default FormInput;
export { FormTextarea };
