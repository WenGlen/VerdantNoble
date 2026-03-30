function ValueBlock({ value, valueHref }) {
  if (value == null || value === "") return null;
  if (valueHref) {
    return (
      <a
        href={valueHref}
        className="text-default underline underline-offset-2 hover:opacity-80"
      >
        {value}
      </a>
    );
  }
  return <p className="text-default">{value}</p>;
}

export default function TextCard({ context, context2 }) {
  return (
    <div className="w-full h-fit bg-panel-50 p-4 rounded-md space-y-2">
      {context && (
        <div className="flex gap-2">
          <p className="w-full max-w-[32px] text-muted">{context.label}</p>
          <div className="space-y-0">
            <ValueBlock value={context.value} valueHref={context.valueHref} />
            {context.value2 && <p className="text-default">{context.value2}</p>}
            {context.value3 && <p className="text-default">{context.value3}</p>}
          </div>
        </div>
      )}
      {context2 && (
        <div className="flex gap-2">
          <p className="w-full max-w-[32px]  text-muted">{context2.label}</p>
          <div>
            <ValueBlock value={context2.value} valueHref={context2.valueHref} />
          </div>
        </div>
      )}
    </div>
  );
}
