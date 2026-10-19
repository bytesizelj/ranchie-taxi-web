import { db } from '@/lib/firebase';
import { collection, doc, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { InvoiceCurrency, InvoiceLineItem } from '@/lib/invoices';

export type ReceiptCurrency = InvoiceCurrency;
export type ReceiptLineItem = InvoiceLineItem;

export const PAYMENT_METHODS = ['Cash EC$', 'Cash US$', 'Bank transfer', 'Cheque', 'Other'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface ReceiptRecord {
  receiptNumber: string;
  receiptDate: string;
  receivedFrom: string;
  description: string;
  serviceDate: string;
  lineItems: ReceiptLineItem[];
  total: number;
  currency: ReceiptCurrency;
  paymentMethod: PaymentMethod;
  bookingId?: string;
  status?: 'void';
  createdAt: any;
}

export const isReceiptVoid = (r: Pick<ReceiptRecord, 'status'> | null | undefined): boolean => r?.status === 'void';

/**
 * Marks a receipt VOID. The document stays in place and keeps its number; the Firestore
 * rules only permit this single-field change, so nothing else about the record can move.
 */
export const voidReceipt = async (receiptId: string): Promise<void> => {
  await updateDoc(doc(db, 'receipts', receiptId), { status: 'void' });
};

export type NewReceiptInput = Omit<ReceiptRecord, 'receiptNumber' | 'createdAt'>;

// Receipts are new to the app, so the sequence starts at R-00001.
export const RECEIPT_SEQUENCE_START = 1;
const COUNTER_PATH = ['counters', 'receipts'] as const;

export const formatReceiptNumber = (n: number): string => `R-${String(n).padStart(5, '0')}`;

/**
 * Allocates the next receipt number and writes the receipt in ONE Firestore transaction.
 * Two simultaneous saves can never receive the same number: the transaction re-runs
 * if the counter changed underneath it. Returns the new receipt document id.
 */
export const createReceipt = async (input: NewReceiptInput): Promise<string> => {
  const counterRef = doc(db, COUNTER_PATH[0], COUNTER_PATH[1]);
  const receiptRef = doc(collection(db, 'receipts'));

  await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const current = counterSnap.exists() ? Number(counterSnap.data().next) : NaN;
    const next = Number.isInteger(current) && current >= RECEIPT_SEQUENCE_START ? current : RECEIPT_SEQUENCE_START;

    tx.set(counterRef, { next: next + 1, updatedAt: serverTimestamp() }, { merge: true });

    const record: Record<string, unknown> = {
      ...input,
      receiptNumber: formatReceiptNumber(next),
      createdAt: serverTimestamp()
    };
    // Firestore rejects undefined values; only store bookingId when present.
    if (!input.bookingId) delete record.bookingId;

    tx.set(receiptRef, record);
  });

  return receiptRef.id;
};
