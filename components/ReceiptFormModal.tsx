'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Plus, Trash2 } from 'lucide-react';
import { todayKey, formatMoney } from '@/lib/invoices';
import {
  createReceipt,
  PAYMENT_METHODS,
  type PaymentMethod,
  type ReceiptCurrency,
  type NewReceiptInput
} from '@/lib/receipts';

export interface ReceiptPrefill {
  receivedFrom?: string;
  description?: string;
  serviceDate?: string;
  bookingId?: string;
}

interface Props {
  open: boolean;
  prefill: ReceiptPrefill | null;
  onClose: () => void;
  onSaved: (receiptId: string) => void;
}

interface LineDraft {
  description: string;
  price: string;
  jobs: string;
  subtotal: string;
}

const FIELD_CLASS =
  'w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none text-sm text-gray-900 bg-white placeholder:text-gray-400';
const SMALL_FIELD_CLASS =
  'w-full p-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none text-sm text-gray-900 bg-white placeholder:text-gray-400';

const emptyLine = (): LineDraft => ({ description: '', price: '', jobs: '1', subtotal: '' });

const toNumber = (s: string): number => {
  const n = parseFloat(String(s).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const money = (n: number): string => (Math.round(n * 100) / 100).toFixed(2);

export default function ReceiptFormModal({ open, prefill, onClose, onSaved }: Props) {
  const [receivedFrom, setReceivedFrom] = useState('');
  const [description, setDescription] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [currency, setCurrency] = useState<ReceiptCurrency>('EC$');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash EC$');
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [total, setTotal] = useState('');
  const [totalTouched, setTotalTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Reset to a clean form (with any prefill) each time the modal opens.
  useEffect(() => {
    if (!open) return;
    const today = todayKey();
    setReceivedFrom(prefill?.receivedFrom || '');
    setDescription(prefill?.description || '');
    setReceiptDate(today);
    setServiceDate(prefill?.serviceDate && /^\d{4}-\d{2}-\d{2}$/.test(prefill.serviceDate) ? prefill.serviceDate : today);
    setCurrency('EC$');
    setPaymentMethod('Cash EC$');
    setLines([{ ...emptyLine(), description: prefill?.description || '' }]);
    setTotal('');
    setTotalTouched(false);
    setErrors({});
    setSaving(false);
  }, [open, prefill]);

  const sumOfSubtotals = lines.reduce((acc, l) => acc + toNumber(l.subtotal), 0);

  // Total follows the line items until Ranchie edits it by hand.
  useEffect(() => {
    if (!totalTouched) setTotal(sumOfSubtotals > 0 ? money(sumOfSubtotals) : '');
  }, [sumOfSubtotals, totalTouched]);

  // Choosing a cash currency keeps the receipt currency in step with it.
  const changeCurrency = (next: ReceiptCurrency) => {
    setCurrency(next);
    if (paymentMethod === 'Cash EC$' || paymentMethod === 'Cash US$') {
      setPaymentMethod(next === 'US$' ? 'Cash US$' : 'Cash EC$');
    }
  };

  const changePaymentMethod = (next: PaymentMethod) => {
    setPaymentMethod(next);
    if (next === 'Cash EC$') setCurrency('EC$');
    if (next === 'Cash US$') setCurrency('US$');
  };

  const updateLine = (index: number, patch: Partial<LineDraft>) => {
    setLines(prev => prev.map((line, i) => {
      if (i !== index) return line;
      const next = { ...line, ...patch };
      // Price or jobs changed: recompute the subtotal for that row.
      if ('price' in patch || 'jobs' in patch) {
        const p = toNumber(next.price);
        const j = toNumber(next.jobs);
        next.subtotal = p > 0 && j > 0 ? money(p * j) : next.subtotal;
      }
      return next;
    }));
  };

  const addLine = () => setLines(prev => [...prev, emptyLine()]);
  const removeLine = (index: number) => setLines(prev => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

  const close = () => {
    if (saving) return;
    onClose();
  };

  const save = async () => {
    if (saving) return;
    const errs: Record<string, string> = {};
    if (!receivedFrom.trim()) errs.receivedFrom = 'Received from is required.';
    if (!receiptDate) errs.receiptDate = 'Receipt date is required.';
    if (!serviceDate) errs.serviceDate = 'Date of service is required.';

    const items = lines
      .map(l => ({
        description: l.description.trim(),
        price: toNumber(l.price),
        jobs: toNumber(l.jobs),
        subtotal: toNumber(l.subtotal)
      }))
      .filter(l => l.description || l.price || l.subtotal);

    if (items.length === 0 || !items.some(l => l.subtotal > 0)) {
      errs.lines = 'At least one line item with a subtotal is required.';
    }
    const totalValue = toNumber(total);
    if (!(totalValue > 0)) errs.total = 'Total must be greater than zero.';

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const input: NewReceiptInput = {
      receiptDate,
      receivedFrom: receivedFrom.trim(),
      description: description.trim(),
      serviceDate,
      lineItems: items.map(l => ({ ...l, description: l.description || 'Taxi service' })),
      total: Math.round(totalValue * 100) / 100,
      currency,
      paymentMethod,
      bookingId: prefill?.bookingId || undefined
    };

    setSaving(true);
    try {
      const id = await createReceipt(input);
      onSaved(id);
    } catch (err) {
      console.error('Error saving receipt:', err);
      setErrors({ form: 'I could not save this receipt. Please try again.' });
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full my-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">New Receipt</h2>
            <p className="text-xs text-gray-500">The receipt number is assigned when saved.</p>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
            title="Close"
          >
            &#10005;
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Receipt date</label>
              <input type="date" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} className={FIELD_CLASS} />
              {errors.receiptDate && <p className="text-xs text-red-500 mt-1">{errors.receiptDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Currency</label>
              <select value={currency} onChange={(e) => changeCurrency(e.target.value as ReceiptCurrency)} className={FIELD_CLASS}>
                <option value="EC$">EC$</option>
                <option value="US$">US$</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Received from</label>
            <input
              type="text"
              value={receivedFrom}
              onChange={(e) => setReceivedFrom(e.target.value)}
              placeholder="Customer or company name"
              className={FIELD_CLASS}
            />
            {errors.receivedFrom && <p className="text-xs text-red-500 mt-1">{errors.receivedFrom}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description / route</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Argyle Airport to Kingstown"
              className={FIELD_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date of service</label>
              <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} className={FIELD_CLASS} />
              {errors.serviceDate && <p className="text-xs text-red-500 mt-1">{errors.serviceDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Payment method</label>
              <select value={paymentMethod} onChange={(e) => changePaymentMethod(e.target.value as PaymentMethod)} className={FIELD_CLASS}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700">Line items</label>
              <button
                type="button"
                onClick={addLine}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900"
              >
                <Plus size={14} /> Add row
              </button>
            </div>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="bg-amber-50/60 border border-amber-200 rounded-xl p-2 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => updateLine(i, { description: e.target.value })}
                      placeholder="Description"
                      className={SMALL_FIELD_CLASS}
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(i)}
                      disabled={lines.length === 1}
                      className="w-9 h-9 shrink-0 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Price</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={line.price}
                        onChange={(e) => updateLine(i, { price: e.target.value })}
                        placeholder="0.00"
                        className={SMALL_FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Job(s)</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        step="1"
                        value={line.jobs}
                        onChange={(e) => updateLine(i, { jobs: e.target.value })}
                        placeholder="1"
                        className={SMALL_FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">Subtotal</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        value={line.subtotal}
                        onChange={(e) => updateLine(i, { subtotal: e.target.value })}
                        placeholder="0.00"
                        className={SMALL_FIELD_CLASS}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.lines && <p className="text-xs text-red-500 mt-1">{errors.lines}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">Payment received ({currency})</label>
              {totalTouched && (
                <button
                  type="button"
                  onClick={() => setTotalTouched(false)}
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-900"
                >
                  Recalculate ({formatMoney(sumOfSubtotals)})
                </button>
              )}
            </div>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={total}
              onChange={(e) => { setTotalTouched(true); setTotal(e.target.value); }}
              placeholder="0.00"
              className={`${FIELD_CLASS} font-bold`}
            />
            {errors.total && <p className="text-xs text-red-500 mt-1">{errors.total}</p>}
          </div>
        </div>

        {errors.form && <p className="text-xs text-red-500 mt-3">{errors.form}</p>}

        <button
          onClick={save}
          disabled={saving}
          className="w-full mt-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            'Save and View Receipt'
          )}
        </button>
      </div>
    </div>
  );
}
