import { db } from '@/lib/firebase';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export type InvoiceCurrency = 'EC$' | 'US$';

export interface InvoiceLineItem {
  description: string;
  price: number;
  jobs: number;
  subtotal: number;
}

export interface InvoiceRecord {
  invoiceNumber: string;
  invoiceDate: string;
  billToName: string;
  billToLocation: string;
  passengerName: string;
  route: string;
  serviceDate: string;
  lineItems: InvoiceLineItem[];
  total: number;
  currency: InvoiceCurrency;
  bookingId?: string;
  createdAt: any;
}

export type NewInvoiceInput = Omit<InvoiceRecord, 'invoiceNumber' | 'createdAt'>;

// Ranchie's paper sequence ended at 00054, so the app continues from 00055.
export const INVOICE_SEQUENCE_START = 55;
const COUNTER_PATH = ['counters', 'invoices'] as const;

export const formatInvoiceNumber = (n: number): string => String(n).padStart(5, '0');

export const formatMoney = (n: number): string =>
  (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Local YYYY-MM-DD (device clock, never UTC, so the date does not roll at 8pm AST).
export const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatInvoiceDate = (key: string | undefined | null): string => {
  if (typeof key !== 'string') return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return key;
  return new Date(key + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Allocates the next invoice number and writes the invoice in ONE Firestore transaction.
 * Two simultaneous saves can never receive the same number: the transaction re-runs
 * if the counter changed underneath it. Returns the new invoice document id.
 */
export const createInvoice = async (input: NewInvoiceInput): Promise<string> => {
  const counterRef = doc(db, COUNTER_PATH[0], COUNTER_PATH[1]);
  const invoiceRef = doc(collection(db, 'invoices'));

  await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const current = counterSnap.exists() ? Number(counterSnap.data().next) : NaN;
    const next = Number.isInteger(current) && current >= INVOICE_SEQUENCE_START ? current : INVOICE_SEQUENCE_START;

    tx.set(counterRef, { next: next + 1, updatedAt: serverTimestamp() }, { merge: true });

    const record: Record<string, unknown> = {
      ...input,
      invoiceNumber: formatInvoiceNumber(next),
      createdAt: serverTimestamp()
    };
    // Firestore rejects undefined values; only store bookingId when present.
    if (!input.bookingId) delete record.bookingId;

    tx.set(invoiceRef, record);
  });

  return invoiceRef.id;
};
