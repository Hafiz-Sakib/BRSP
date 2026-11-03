import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// পিডিএফ/ছবি — পেজ ছেড়ে না গিয়ে ভেতরেই দেখার ভিউয়ার। pdf.js শুধু প্রথমবার "দেখুন" চাপলে লোড হয়।
let pdfjsPromise;
const loadPdfjs = () =>
  (pdfjsPromise ||= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    return lib;
  }));

const isImage = (u) => /\.(jpe?g|png|webp|gif|avif)$/i.test(u);

function PdfPage({ doc, n, width, ratio }) {
  const box = useRef(null);
  const cv = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px' },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return undefined;
    let task;
    let dead = false;
    (async () => {
      const page = await doc.getPage(n);
      if (dead) return;
      const base = page.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vp = page.getViewport({ scale: (width / base.width) * dpr });
      const c = cv.current;
      c.width = vp.width;
      c.height = vp.height;
      c.style.width = `${width}px`;
      c.style.height = `${vp.height / dpr}px`;
      task = page.render({ canvasContext: c.getContext('2d'), viewport: vp });
      try {
        await task.promise;
      } catch {
        /* বাতিল */
      }
    })();
    return () => {
      dead = true;
      task?.cancel();
    };
  }, [seen, doc, n, width]);

  return (
    <div ref={box} style={{ width, minHeight: width * ratio }} className="mx-auto mb-3 bg-white shadow-md">
      <canvas ref={cv} className="block" />
    </div>
  );
}

function PdfPages({ url, zoom, hostRef, onState }) {
  const [doc, setDoc] = useState(null);
  const [ratio, setRatio] = useState(1.41);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = hostRef.current;
    const measure = () => setW(Math.min(el.clientWidth - 24, 900));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [hostRef]);

  useEffect(() => {
    let dead = false;
    let loaded;
    onState('load');
    loadPdfjs()
      .then((lib) => lib.getDocument({ url }).promise)
      .then(async (d) => {
        loaded = d;
        if (dead) return d.destroy();
        const p1 = await d.getPage(1);
        const v = p1.getViewport({ scale: 1 });
        setRatio(v.height / v.width);
        setDoc(d);
        onState('ok', d.numPages);
        return undefined;
      })
      .catch(() => !dead && onState('err'));
    return () => {
      dead = true;
      loaded?.destroy();
    };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!doc || !w) return null;
  const width = Math.round(w * (zoom ? 1.8 : 1));
  return (
    <div key={width} className="w-max mx-auto">
      {Array.from({ length: doc.numPages }, (_, i) => (
        <PdfPage key={i} doc={doc} n={i + 1} width={width} ratio={ratio} />
      ))}
    </div>
  );
}

// file = { url, title, filename }
export default function FileViewer({ file, onClose }) {
  const [zoom, setZoom] = useState(false);
  const [state, setState] = useState(isImage(file.url) ? 'ok' : 'load');
  const [pages, setPages] = useState(0);
  const host = useRef(null);
  const img = isImage(file.url);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onState = (s, n) => {
    setState(s);
    if (n) setPages(n);
  };
  const pill = 'rounded-full border border-white/40 px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap hover:bg-white/10 press';

  // body-তে রেন্ডার — ট্যাব-প্যানেলের transform অ্যানিমেশন fixed পজিশন আটকে দিত
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={file.title} className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-sm" style={{ animation: 'fade-in 0.25s ease-out both', paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between gap-2 px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="font-semibold truncate">{file.title}</p>
          {pages > 0 && <p className="text-xs text-white/70">{String(pages).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d])} পৃষ্ঠা</p>}
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          <button type="button" onClick={() => setZoom((z) => !z)} className={pill}>
            {zoom ? 'ছোট করুন' : 'বড় করুন'}
          </button>
          <a href={file.url} download={file.filename} className={`${pill} hidden sm:inline-block`}>
            ডাউনলোড
          </a>
          <button type="button" onClick={onClose} aria-label="বন্ধ করুন" className="grid place-items-center w-9 h-9 rounded-full bg-white text-brsp-ink press">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={host} className="flex-1 overflow-auto px-3 pb-6 thin-scroll" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {img ? (
          <img src={file.url} alt={file.title} className={`mx-auto h-auto rounded-lg bg-white transition-[max-width] duration-300 ${zoom ? 'max-w-[1100px] w-[200%] sm:w-full' : 'max-w-xl w-full'}`} />
        ) : (
          <PdfPages url={file.url} zoom={zoom} hostRef={host} onState={onState} />
        )}
        {state === 'load' && <p className="text-center text-white/80 font-semibold py-16">লোড হচ্ছে…</p>}
        {state === 'err' && (
          <div className="mx-auto max-w-sm text-center text-white py-16">
            <p className="font-semibold">ফাইলটি এখানে দেখানো যায়নি।</p>
            <p className="mt-1 text-sm text-white/70">ইন্টারনেট সংযোগ দেখুন, অথবা নতুন ট্যাবে খুলুন।</p>
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-white text-brsp-ink px-5 py-2 text-sm font-bold">
              নতুন ট্যাবে খুলুন
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
