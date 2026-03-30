export default function OrderSummary({ items, freight = 120, discount = 0 }) {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full flex flex-row gap-4 items-center justify-between"
          >
            <div className="w-16 h-16 bg-placeholder rounded-md overflow-hidden flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🌿</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-md font-bold font-serif">{item.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">
                $NT {item.price.toLocaleString()} × {item.quantity}
              </p>
              <p className="text-sm font-bold">
                $NT {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        <div className="w-full border-t border-border-50 py-4 text-sm text-muted">
          <div className="w-full flex flex-row justify-between">
            <p>小計</p>
            <p>
              $NT
              <span className="font-bold text-textDefaultColor">
                {" "}
                {items
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString()}
              </span>
            </p>
          </div>
          <div className="w-full flex flex-row justify-between">
            <p>運費</p>
            {freight > 0 ? (
              <p>
                $NT
                <span className="font-bold text-textDefaultColor">
                  {" "}
                  + {freight.toLocaleString()}
                </span>
              </p>
            ) : (
              <p>免運費</p>
            )}
          </div>
          {discount > 0 && (
            <div className="w-full flex flex-row justify-between text-muted">
              <p className="m-0">折扣</p>
              <p className="m-0">
                $NT
                <span className="font-bold text-textDefaultColor">
                  {" "}
                  - {discount.toLocaleString()}
                </span>
              </p>
            </div>
          )}
          <div className="w-full flex flex-row justify-between">
            <p>總計</p>
            <p className="text-md font-bold text-primary">
              $NT{" "}
              {(
                items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0,
                ) +
                freight -
                discount
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
