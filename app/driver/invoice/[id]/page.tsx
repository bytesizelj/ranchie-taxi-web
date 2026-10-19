'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Great_Vibes } from 'next/font/google';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Lock, Printer, RefreshCw, FileText, MessageCircle } from 'lucide-react';
import { formatMoney, formatInvoiceDate, type InvoiceRecord } from '@/lib/invoices';

const scriptFont = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap' });

const NAVY = '#15213b';
const GOLD = '#e0aa2e';
const GOLD_LIGHT = '#f5d55a';

// A4 at 96dpi. The sheet is always laid out at this width and scaled to fit the screen,
// so the on-screen view, the printed page and the shared image are the same document.
const SHEET_WIDTH = 794;
const SHEET_MIN_HEIGHT = 1050;

const CONTACT = {
  phone: '1 784 493 2354',
  emails: ['ranch8622@hotmail.com', 'ranchietax@gmail.com']
};

const SHARE_TEXT = 'Please find my invoice attached. Thank you for choosing Ranchie Taxi.';

export default function InvoiceViewPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const DRIVER_PIN = process.env.NEXT_PUBLIC_DRIVER_PIN || '';
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Scale-to-fit for the fixed-width sheet
  const shellRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(SHEET_MIN_HEIGHT);

  // Share to WhatsApp
  const [sharing, setSharing] = useState(false);
  const [shareNote, setShareNote] = useState('');

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
    if (!isAuthenticated || !invoiceId) return;
    let cancelled = false;
    setLoading(true);
    getDoc(doc(db, 'invoices', invoiceId))
      .then((snap) => {
        if (cancelled) return;
        if (snap.exists()) {
          setInvoice(snap.data() as InvoiceRecord);
        } else {
          setLoadError('I could not find this invoice.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Invoice load error:', err);
        if (cancelled) return;
        setLoadError('I could not load this invoice. Please try again.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, invoiceId]);

  // Fit the 794px sheet to whatever width is available (phones get a scaled-down preview).
  useEffect(() => {
    if (!invoice) return;
    const measure = () => {
      const available = shellRef.current?.clientWidth || SHEET_WIDTH;
      setScale(Math.min(1, available / SHEET_WIDTH));
      if (sheetRef.current) setSheetHeight(sheetRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' && sheetRef.current ? new ResizeObserver(measure) : null;
    if (ro && sheetRef.current) ro.observe(sheetRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [invoice]);

  // Clear the helper note after a few seconds
  useEffect(() => {
    if (!shareNote) return;
    const t = setTimeout(() => setShareNote(''), 6000);
    return () => clearTimeout(t);
  }, [shareNote]);

  const renderSheetToPng = async (): Promise<Blob> => {
    const el = sheetRef.current;
    if (!el) throw new Error('Invoice sheet is not ready.');
    const { default: html2canvas } = await import('html2canvas-pro');
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: SHEET_WIDTH,
      height: el.offsetHeight,
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        // The capture must be the flat document: no screen scaling, shadow or rounded corners.
        const wrap = clonedDoc.querySelector<HTMLElement>('.invoice-scale');
        if (wrap) { wrap.style.transform = 'none'; wrap.style.width = `${SHEET_WIDTH}px`; wrap.style.height = 'auto'; }
        const sheet = clonedDoc.querySelector<HTMLElement>('.invoice-sheet');
        if (sheet) { sheet.style.boxShadow = 'none'; sheet.style.borderRadius = '0'; }
      }
    });
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image.'))), 'image/png');
    });
  };

  const shareToWhatsApp = async () => {
    if (!invoice || sharing) return;
    setSharing(true);
    setShareNote('');
    try {
      const blob = await renderSheetToPng();
      const fileName = `invoice-${invoice.invoiceNumber}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };

      if (typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
        try {
          await nav.share({ files: [file], title: `Invoice ${invoice.invoiceNumber}`, text: SHARE_TEXT });
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
      setShareNote('I could not prepare the invoice image. Please try again.');
    }
    setSharing(false);
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
            <p className="text-gray-500 text-sm">Enter your PIN to view this invoice</p>
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

  const subtotalSum = invoice ? invoice.lineItems.reduce((acc, l) => acc + (Number(l.subtotal) || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-gray-200 print:bg-white">
      <style>{`
        .invoice-sheet {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          html, body { background: #ffffff !important; }
          .no-print { display: none !important; }
          .invoice-shell { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .invoice-scale { transform: none !important; width: 100% !important; height: auto !important; }
          .invoice-sheet { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; width: 100% !important; }
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
            <p className="font-bold text-gray-900 truncate">
              {invoice ? `Invoice #${invoice.invoiceNumber}` : 'Invoice'}
            </p>
            <p className="text-xs text-gray-500 truncate">Ranchie Taxi Service</p>
          </div>
          {invoice && (
            <>
              <button
                onClick={shareToWhatsApp}
                disabled={sharing}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold shadow-md ring-2 ring-white/70 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Send this invoice as an image on WhatsApp"
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

      <div ref={shellRef} className="invoice-shell max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="no-print text-center py-16">
            <RefreshCw className="animate-spin mx-auto mb-3 text-amber-500" size={32} />
            <p className="text-gray-600">Loading invoice...</p>
          </div>
        ) : loadError || !invoice ? (
          <div className="no-print text-center py-16 bg-white rounded-2xl">
            <FileText className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-600">{loadError || 'I could not find this invoice.'}</p>
            <Link href="/driver" className="inline-block mt-4 text-sm font-semibold text-amber-700 hover:text-amber-900">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div
            className="invoice-scale mx-auto"
            style={{
              width: SHEET_WIDTH * scale,
              height: sheetHeight * scale,
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
          >
          <div
            ref={sheetRef}
            className="invoice-sheet relative bg-white shadow-2xl rounded-lg overflow-hidden text-gray-900"
            style={{ width: SHEET_WIDTH, minHeight: SHEET_MIN_HEIGHT, fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            {/* Decorative wave header: navy band with a gold ribbon */}
            <div className="absolute inset-x-0 top-0 h-40 pointer-events-none" aria-hidden="true">
              <div
                className="absolute -top-24 -right-16 h-64 w-[130%]"
                style={{
                  background: NAVY,
                  borderRadius: '0 0 55% 45% / 0 0 100% 100%',
                  transform: 'rotate(-4deg)'
                }}
              />
              <div
                className="absolute -top-28 -right-10 h-56 w-[120%]"
                style={{
                  background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                  borderRadius: '0 0 60% 40% / 0 0 100% 100%',
                  transform: 'rotate(-7deg)',
                  opacity: 0.95
                }}
              />
              <div
                className="absolute -top-32 -right-4 h-52 w-[115%]"
                style={{
                  background: NAVY,
                  borderRadius: '0 0 65% 35% / 0 0 100% 100%',
                  transform: 'rotate(-9deg)'
                }}
              />
            </div>

            {/* Header content */}
            <div className="relative px-12 pt-8 flex items-start justify-between">
              <div className="bg-white/95 rounded-2xl p-2 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/rts-logo.png" alt="Ranchie Taxi Service" width={150} height={173} style={{ width: 150, height: 'auto' }} />
              </div>
              <div className="text-right pt-24">
                <h1 className="text-5xl font-extrabold tracking-[0.2em]" style={{ color: NAVY }}>INVOICE</h1>
                <p className="mt-2 text-sm font-semibold text-gray-700">
                  Invoice No. <span className="font-bold" style={{ color: NAVY }}>{invoice.invoiceNumber}</span>
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  Date: <span className="font-bold" style={{ color: NAVY }}>{formatInvoiceDate(invoice.invoiceDate)}</span>
                </p>
              </div>
            </div>

            {/* Invoice To */}
            <div className="relative px-12 mt-8">
              <p className="text-xs font-extrabold tracking-[0.25em]" style={{ color: GOLD }}>INVOICE TO</p>
              <p className="mt-1 text-xl font-bold" style={{ color: NAVY }}>{invoice.billToName}</p>
              {invoice.billToLocation && <p className="text-sm text-gray-700">{invoice.billToLocation}</p>}
              <div className="mt-3 text-sm text-gray-800 space-y-0.5">
                {invoice.passengerName && (
                  <p><span className="font-semibold">Passenger:</span> {invoice.passengerName}</p>
                )}
                {invoice.route && (
                  <p><span className="font-semibold">Route:</span> {invoice.route}</p>
                )}
                <p><span className="font-semibold">Date of service:</span> {formatInvoiceDate(invoice.serviceDate)}</p>
              </div>
            </div>

            {/* Line items */}
            <div className="relative px-12 mt-8">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ background: GOLD_LIGHT, color: NAVY }}>
                    <th className="text-left font-extrabold tracking-wider px-3 py-3">DESCRIPTION</th>
                    <th className="text-right font-extrabold tracking-wider px-3 py-3 whitespace-nowrap">PRICE ({invoice.currency})</th>
                    <th className="text-center font-extrabold tracking-wider px-3 py-3 whitespace-nowrap">JOB(S)</th>
                    <th className="text-right font-extrabold tracking-wider px-3 py-3 whitespace-nowrap">SUBTOTAL ({invoice.currency})</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-900">{item.description}</td>
                      <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">{formatMoney(item.price)}</td>
                      <td className="px-3 py-3 text-center text-gray-900">{item.jobs}</td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatMoney(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 ml-auto w-80">
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="font-semibold text-gray-700">Sub-total</span>
                  <span className="font-semibold text-gray-900">{invoice.currency} {formatMoney(subtotalSum)}</span>
                </div>
                <div
                  className="flex items-center justify-between px-3 py-3 rounded-md"
                  style={{ background: GOLD_LIGHT, color: NAVY }}
                >
                  <span className="text-sm font-extrabold tracking-wider">TOTAL</span>
                  <span className="text-lg font-extrabold">{invoice.currency} {formatMoney(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Contact + sign-off */}
            <div className="relative px-12 mt-10 mb-28 grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-extrabold tracking-[0.25em]" style={{ color: GOLD }}>CONTACT DETAILS</p>
                <div className="mt-2 text-sm text-gray-800 space-y-0.5">
                  <p>{CONTACT.phone}</p>
                  {CONTACT.emails.map((e) => <p key={e}>{e}</p>)}
                </div>
                <div className="mt-6 flex items-end gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/ranchie-qr.png" alt="Ranchie Taxi QR code" width={96} height={96} style={{ width: 96, height: 96 }} />
                  <p className={`${scriptFont.className} text-5xl leading-none`} style={{ color: NAVY }}>Thank You</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/signature.png" alt="Signature of Lawrence Russell" width={200} height={133} style={{ width: 200, height: 'auto' }} />
                <div className="mt-1 pt-2 border-t-2 w-56 text-right" style={{ borderColor: NAVY }}>
                  <p className="text-sm font-extrabold tracking-[0.15em]" style={{ color: NAVY }}>LAWRENCE RUSSELL</p>
                  <p className="text-xs text-gray-600">Operator</p>
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="absolute inset-x-0 bottom-0">
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)` }} />
              <div className="py-4 px-8 text-center text-sm font-semibold text-white" style={{ background: NAVY }}>
                Kindly make cheques payable to Lawrence Russell.
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
