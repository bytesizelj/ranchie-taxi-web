'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Lock, Printer, RefreshCw, Receipt, MessageCircle, Ban } from 'lucide-react';
import { formatMoney, formatInvoiceDate } from '@/lib/invoices';
import { isReceiptVoid, voidReceipt, type ReceiptRecord } from '@/lib/receipts';

const NAVY = '#15213b';
const GOLD = '#e0aa2e';

// 80mm POS proportions. The strip is always laid out at this width (scaled down only when the
// viewport is narrower), so the on-screen view, the print and the shared image are the same strip.
const STRIP_WIDTH = 360;

const CONTACT = {
  phone: '1 784 493 2354',
  email: 'ranch8622@hotmail.com'
};

const SHARE_TEXT = 'Please find my receipt attached. Thank you for travelling with Ranchie Taxi.';

const Dashed = () => (
  <div className="my-3" style={{ borderTop: `2px dashed ${GOLD}` }} aria-hidden="true" />
);

export default function ReceiptViewPage() {
  const params = useParams();
  const receiptId = params.id as string;

  const DRIVER_PIN = process.env.NEXT_PUBLIC_DRIVER_PIN || '';
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [receipt, setReceipt] = useState<ReceiptRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Scale-to-fit for the fixed-width strip (only matters below 360px of available width)
  const shellRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [stripHeight, setStripHeight] = useState(0);

  // Share to WhatsApp
  const [sharing, setSharing] = useState(false);
  const [shareNote, setShareNote] = useState('');

  // Void
  const [confirmVoid, setConfirmVoid] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const [voidError, setVoidError] = useState('');

  // Same gate as the dashboard: PIN once, remembered in localStorage.
  useEffect(() => {
    if (localStorage.getItem('driverAuth') === 'true') setIsAuthenticated(true);
    setAuthChecked(true);
  }, []);

  const handleLogin = () => {
    if (password === DRIVER_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('driverAuth', 'true');
      setError('');
    } else {
      setError('Incorrect PIN');
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !receiptId) return;
    let cancelled = false;
    setLoading(true);
    getDoc(doc(db, 'receipts', receiptId))
      .then((snap) => {
        if (cancelled) return;
        if (snap.exists()) {
          setReceipt(snap.data() as ReceiptRecord);
        } else {
          setLoadError('I could not find this receipt.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Receipt load error:', err);
        if (cancelled) return;
        setLoadError('I could not load this receipt. Please try again.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, receiptId]);

  useEffect(() => {
    if (!receipt) return;
    const measure = () => {
      const available = shellRef.current?.clientWidth || STRIP_WIDTH;
      setScale(Math.min(1, available / STRIP_WIDTH));
      if (stripRef.current) setStripHeight(stripRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' && stripRef.current ? new ResizeObserver(measure) : null;
    if (ro && stripRef.current) ro.observe(stripRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [receipt]);

  useEffect(() => {
    if (!shareNote) return;
    const t = setTimeout(() => setShareNote(''), 6000);
    return () => clearTimeout(t);
  }, [shareNote]);

  const renderStripToPng = async (): Promise<Blob> => {
    const el = stripRef.current;
    if (!el) throw new Error('Receipt is not ready.');
    const { default: html2canvas } = await import('html2canvas-pro');
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: STRIP_WIDTH,
      height: el.offsetHeight,
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        // The capture must be the flat strip: no screen scaling, shadow or rounded corners.
        const wrap = clonedDoc.querySelector<HTMLElement>('.receipt-scale');
        if (wrap) { wrap.style.transform = 'none'; wrap.style.width = `${STRIP_WIDTH}px`; wrap.style.height = 'auto'; }
        const strip = clonedDoc.querySelector<HTMLElement>('.receipt-strip');
        if (strip) { strip.style.boxShadow = 'none'; strip.style.borderRadius = '0'; }
      }
    });
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image.'))), 'image/png');
    });
  };

  const shareToWhatsApp = async () => {
    if (!receipt || sharing) return;
    setSharing(true);
    setShareNote('');
    try {
      const blob = await renderStripToPng();
      const fileName = `receipt-${receipt.receiptNumber}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };

      if (typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: `Receipt ${receipt.receiptNumber}`, text: SHARE_TEXT });
        } catch (err) {
          // User closed the share sheet: nothing to report.
          if (!(err instanceof Error && err.name === 'AbortError')) throw err;
        }
      } else {
        // Desktop or older browsers: download the image for manual attaching.
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        setShareNote('Image downloaded - attach it in WhatsApp.');
      }
    } catch (err) {
      console.error('Share error:', err);
      setShareNote('I could not prepare the receipt image. Please try again.');
    }
    setSharing(false);
  };

  const handleVoid = async () => {
    if (!receipt || voiding) return;
    setVoiding(true);
    setVoidError('');
    try {
      await voidReceipt(receiptId);
      setReceipt({ ...receipt, status: 'void' });
      setConfirmVoid(false);
    } catch (err) {
      console.error('Void error:', err);
      setVoidError('I could not void this receipt.');
    }
    setVoiding(false);
  };

  if (!authChecked) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Driver Login</h1>
            <p className="text-gray-500 text-sm">Enter your PIN to view this receipt</p>
          </div>
          <input
            type="password"
            placeholder="Enter PIN"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-center text-2xl tracking-widest mb-4"
          />
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Login
          </button>
          <Link href="/driver" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 print:bg-white">
      <style>{`
        .receipt-strip {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          @page { margin: 10mm; }
          html, body { background: #ffffff !important; }
          .no-print { display: none !important; }
          .receipt-shell { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .receipt-scale { transform: none !important; width: ${STRIP_WIDTH}px !important; height: auto !important; margin: 0 auto !important; }
          .receipt-strip { box-shadow: none !important; border-radius: 0 !important; margin: 0 auto !important; }
        }
      `}</style>

      {/* App chrome (hidden when printing) */}
      <div className="no-print sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3">
          <Link
            href="/driver"
            className="w-10 h-10 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate flex items-center gap-2">
              {receipt ? `Receipt ${receipt.receiptNumber}` : 'Receipt'}
              {receipt && isReceiptVoid(receipt) && (
                <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 ring-1 ring-red-200">VOID</span>
              )}
            </p>
            <p className="text-xs text-gray-500 truncate">Ranchie Taxi Service</p>
          </div>
          {receipt && (
            <>
              <button
                onClick={shareToWhatsApp}
                disabled={sharing}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shadow-md ring-2 ring-white/70 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Send this receipt as an image on WhatsApp"
              >
                {sharing ? <RefreshCw size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                <span className="hidden sm:inline">{sharing ? 'Preparing...' : 'Send to WhatsApp'}</span>
                <span className="sm:hidden">{sharing ? '...' : 'WhatsApp'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 text-sm font-bold shadow-md ring-2 ring-white/70 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Printer size={16} />
                <span className="hidden sm:inline">Print / Save as PDF</span>
                <span className="sm:hidden">Print</span>
              </button>
            </>
          )}
        </div>
        {shareNote && (
          <div className="max-w-4xl mx-auto px-4 pb-3">
            <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              {shareNote}
            </p>
          </div>
        )}
      </div>

      <div ref={shellRef} className="receipt-shell max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="no-print text-center py-16">
            <RefreshCw className="animate-spin mx-auto mb-3 text-amber-500" size={32} />
            <p className="text-gray-600">Loading receipt...</p>
          </div>
        ) : loadError || !receipt ? (
          <div className="no-print text-center py-16 bg-white rounded-2xl">
            <Receipt className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-600">{loadError || 'I could not find this receipt.'}</p>
            <Link href="/driver" className="inline-block mt-4 text-sm font-semibold text-amber-700 hover:text-amber-900">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div
            className="receipt-scale mx-auto"
            style={{
              width: STRIP_WIDTH * scale,
              height: stripHeight ? stripHeight * scale : undefined,
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
          >
          <div
            ref={stripRef}
            className="receipt-strip relative bg-white shadow-2xl rounded-md overflow-hidden text-gray-900"
            style={{ width: STRIP_WIDTH, padding: '22px 22px 24px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 12.5, lineHeight: 1.35 }}
          >
            {/* Gold cap line, as on a register strip */}
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: GOLD }} aria-hidden="true" />

            {/* VOID watermark: part of the strip, so it prints and is captured in the share image */}
            {isReceiptVoid(receipt) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
                <span
                  className="font-extrabold tracking-[0.25em] leading-none"
                  style={{
                    color: '#dc2626',
                    opacity: 0.2,
                    fontSize: '88px',
                    transform: 'rotate(-30deg)',
                    border: '7px solid #dc2626',
                    borderRadius: '14px',
                    padding: '6px 16px 6px 24px'
                  }}
                >
                  VOID
                </span>
              </div>
            )}

            {/* Header */}
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rts-logo.png" alt="Ranchie Taxi Service" width={90} height={104} style={{ width: 90, height: 'auto', margin: '0 auto' }} />
              <p className="mt-2 font-extrabold tracking-[0.2em]" style={{ color: NAVY, fontSize: 15 }}>RANCHIE TAXI SERVICE</p>
              <p className="text-gray-700" style={{ fontSize: 11 }}>{CONTACT.phone} | {CONTACT.email}</p>
            </div>

            <Dashed />

            {/* Receipt number + date */}
            <div className="flex items-baseline justify-between">
              <p className="font-extrabold tracking-wider" style={{ color: NAVY, fontSize: 14 }}>RECEIPT {receipt.receiptNumber}</p>
              <p className="text-gray-700" style={{ fontSize: 11.5 }}>{formatInvoiceDate(receipt.receiptDate)}</p>
            </div>
            <p className="mt-2" style={{ fontSize: 12.5 }}>
              <span className="font-bold tracking-wider" style={{ color: GOLD, fontSize: 10.5 }}>RECEIVED FROM</span>
              <br />
              <span className="font-bold" style={{ color: NAVY, fontSize: 14 }}>{receipt.receivedFrom}</span>
            </p>
            {receipt.description && (
              <p className="mt-1 text-gray-800">{receipt.description}</p>
            )}
            <p className="text-gray-700" style={{ fontSize: 11.5 }}>Date of service: {formatInvoiceDate(receipt.serviceDate)}</p>

            <Dashed />

            {/* Line items: stacked rows */}
            <div className="space-y-1.5">
              {receipt.lineItems.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-gray-900">{item.description}</p>
                    {Number(item.jobs) > 1 && (
                      <p className="text-gray-500" style={{ fontSize: 10.5 }}>{item.jobs} x {formatMoney(item.price)}</p>
                    )}
                  </div>
                  <p className="shrink-0 text-gray-900 whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatMoney(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <Dashed />

            {/* Payment received */}
            <div className="flex items-center justify-between rounded-md px-3 py-2" style={{ background: NAVY, color: '#ffffff' }}>
              <span className="font-extrabold tracking-wider" style={{ fontSize: 12 }}>PAYMENT RECEIVED</span>
              <span className="font-extrabold whitespace-nowrap" style={{ fontSize: 16, color: '#f5d55a', fontVariantNumeric: 'tabular-nums' }}>
                {receipt.currency} {formatMoney(receipt.total)}
              </span>
            </div>
            <p className="mt-2 text-gray-800" style={{ fontSize: 11.5 }}>
              <span className="font-bold">Payment method:</span> {receipt.paymentMethod}
            </p>

            <Dashed />

            {/* Sign-off */}
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/signature.png" alt="Signature of Lawrence Russell" width={120} height={80} style={{ width: 120, height: 'auto', margin: '0 auto' }} />
              <p className="font-bold tracking-wider" style={{ color: NAVY, fontSize: 11.5 }}>Lawrence Russell - Operator</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ranchie-qr.png" alt="Ranchie Taxi QR code" width={72} height={72} style={{ width: 72, height: 72, margin: '12px auto 0' }} />
              <p className="mt-3 text-gray-800" style={{ fontSize: 11.5 }}>Thank you for travelling with Ranchie Taxi.</p>
            </div>
          </div>
          </div>
        )}

        {/* Void action: deliberately understated, voiding is rare */}
        {receipt && !isReceiptVoid(receipt) && (
          <div className="no-print max-w-[360px] mx-auto mt-4 text-center">
            {!confirmVoid ? (
              <button
                onClick={() => { setConfirmVoid(true); setVoidError(''); }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 underline underline-offset-4 transition-colors"
              >
                <Ban size={12} />
                Void Receipt
              </button>
            ) : (
              <div className="inline-block bg-white border border-red-200 rounded-2xl shadow-md px-5 py-4 text-left">
                <p className="text-sm font-semibold text-gray-900">
                  Void receipt {receipt.receiptNumber}? It will remain in your records marked VOID.
                </p>
                {voidError && <p className="text-xs text-red-600 mt-1">{voidError}</p>}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleVoid}
                    disabled={voiding}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {voiding ? <RefreshCw size={14} className="animate-spin" /> : <Ban size={14} />}
                    {voiding ? 'Voiding...' : 'Yes, void it'}
                  </button>
                  <button
                    onClick={() => { setConfirmVoid(false); setVoidError(''); }}
                    disabled={voiding}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all disabled:opacity-60"
                  >
                    Keep
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
