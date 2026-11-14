"use client";

import { useId, useState } from "react";
import { restoreOrderStock, updateOrderCourier, updateOrderNotes, updateOrderStatus } from "@/app/admin/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { useAdminAction } from "./use-admin-action";

const cardClass = "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4";
const labelClass = "text-label font-semibold text-ink";

export const StatusForm = ({ orderNumber, status }: { orderNumber: string; status: OrderStatus }) => {
  const id = useId();
  const { pending, run } = useAdminAction();
  const [next, setNext] = useState<OrderStatus>(status);
  const [note, setNote] = useState("");

  return (
    <form
      className={cardClass}
      onSubmit={(event) => {
        event.preventDefault();
        run(() => updateOrderStatus(orderNumber, { status: next, note }), () => setNote(""));
      }}
    >
      <h2 className="text-panel-title text-ink">Update status</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-status`} className={labelClass}>
          Status
        </label>
        <Select value={next} onValueChange={(value) => setNext(value as OrderStatus)}>
          <SelectTrigger id={`${id}-status`} className="h-11! w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-surface">
            {ORDER_STATUSES.map((value) => (
              <SelectItem key={value} value={value} className="min-h-10">
                {ORDER_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-note`} className={labelClass}>
          Note <span className="font-normal text-ink-muted">(optional, saved in the history)</span>
        </label>
        <Input id={`${id}-note`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="e.g. Called twice, no answer" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save status"}
      </Button>
    </form>
  );
};

export const CourierForm = ({
  orderNumber,
  courier,
}: {
  orderNumber: string;
  courier: { name: string; trackingId: string; trackingUrl: string };
}) => {
  const id = useId();
  const { pending, run } = useAdminAction();
  const [values, setValues] = useState(courier);
  const field = (key: keyof typeof values, label: string, placeholder: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-${key}`} className={labelClass}>
        {label}
      </label>
      <Input
        id={`${id}-${key}`}
        value={values[key]}
        placeholder={placeholder}
        onChange={(event) => setValues({ ...values, [key]: event.target.value })}
      />
    </div>
  );

  return (
    <form
      className={cardClass}
      onSubmit={(event) => {
        event.preventDefault();
        run(() => updateOrderCourier(orderNumber, values));
      }}
    >
      <h2 className="text-panel-title text-ink">Courier</h2>
      {field("name", "Courier name", "e.g. Pathao, Steadfast, RedX")}
      {field("trackingId", "Tracking ID", "Consignment / tracking number")}
      {field("trackingUrl", "Tracking link (optional)", "https://…")}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Saving…" : "Save courier"}
      </Button>
    </form>
  );
};

export const NotesForm = ({ orderNumber, notes }: { orderNumber: string; notes: string }) => {
  const id = useId();
  const { pending, run } = useAdminAction();
  const [value, setValue] = useState(notes);

  return (
    <form
      className={cardClass}
      onSubmit={(event) => {
        event.preventDefault();
        run(() => updateOrderNotes(orderNumber, value));
      }}
    >
      <label htmlFor={`${id}-notes`} className="text-panel-title font-heading font-bold text-ink">
        Admin notes
      </label>
      <Textarea
        id={`${id}-notes`}
        rows={3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Only admins see this."
      />
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Saving…" : "Save notes"}
      </Button>
    </form>
  );
};

export const RestoreStockButton = ({ orderNumber }: { orderNumber: string }) => {
  const { pending, run } = useAdminAction();
  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Put this order's items back into stock? This can only be done once.")) {
          run(() => restoreOrderStock(orderNumber));
        }
      }}
    >
      {pending ? "Restoring…" : "Put items back in stock"}
    </Button>
  );
};
