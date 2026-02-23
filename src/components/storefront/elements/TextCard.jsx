export default function TextCard({ 
    context,
    context2,
}) {
    return (
        <div className="w-full h-fit bg-panel-50 p-4 rounded-md space-y-2">
            {context && (
                <div className="flex gap-2">
                    <p className="w-full max-w-[32px] text-muted">{context.label}</p>
                    <div>
                    <p className="text-default">{context.value}</p>
                    {context.value2 && (
                        <p className="text-default">{context.value2}</p>
                    )}
                    {context.value3 && (
                        <p className="text-default">{context.value3}</p>
                    )}
                    </div>
                </div>
            )}
            {context2 && (
                <div className="flex gap-2">
                    <p className="w-full max-w-[32px]  text-muted">{context2.label}</p>
                    <p className="text-default">{context2.value}</p>
                </div>
            )}
        </div>
    )
}