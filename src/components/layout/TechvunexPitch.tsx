import React, { useState } from 'react';
import { X, Store, TrendingUp, CreditCard, Boxes, Repeat, MessageCircle, Search as SearchIcon, LayoutDashboard, Cloud, ArrowRight } from 'lucide-react';

const CAPABILITIES: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; desc: string }[] = [
  { icon: Store, title: 'Custom E-Commerce Development', desc: 'Bespoke UX built for sub-second catalog interaction.' },
  { icon: TrendingUp, title: 'Responsive UI/UX', desc: 'High-conversion, frictionless design across every device.' },
  { icon: CreditCard, title: 'Payment Gateway Integration', desc: 'Secure checkout with UPI, cards, wallets & COD.' },
  { icon: Boxes, title: 'Order & Inventory Management', desc: 'Real-time stock sync with your fulfillment pipeline.' },
  { icon: Repeat, title: 'CRM / ERP Integration', desc: 'Direct sync with SAP, Unicommerce, Shopify Plus, NetSuite.' },
  { icon: MessageCircle, title: 'WhatsApp Integration', desc: 'Conversational commerce and automated re-engagement.' },
  { icon: SearchIcon, title: 'SEO & Analytics', desc: 'Data-driven growth and organic discoverability.' },
  { icon: LayoutDashboard, title: 'Custom Admin Dashboard', desc: 'Full operational visibility for your team.' },
  { icon: Cloud, title: 'Cloud Deployment', desc: 'Edge-cached, scalable infrastructure.' },
];

export function TechvunexPitch() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[70]">
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2 px-4 py-2.5 bg-deep-obsidian/95 backdrop-blur-md text-on-primary rounded-full shadow-[0_8px_30px_rgba(15,23,42,0.18)] hover:bg-charcoal-surface border border-white/10 transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-champagne-gold animate-ping" />
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-champagne-gold">Built by</span>
          <span className="font-label-md text-label-md font-semibold text-white">Techvunex Innovations</span>
          <ArrowRight size={16} className="text-white/70 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div
        className={`fixed inset-y-0 right-0 z-[95] w-full max-w-md bg-surface-container-lowest border-l border-slate-border shadow-[0_24px_64px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out flex flex-col ${
          open ? '' : 'translate-x-full'
        }`}
      >
        <div className="p-space-lg bg-deep-obsidian text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-semibold tracking-tight">Techvunex Innovations</span>
            <span className="px-2 py-0.5 rounded bg-champagne-gold/20 text-champagne-gold font-label-caps text-label-caps uppercase">Enterprise</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-space-lg flex-1 overflow-y-auto flex flex-col gap-space-lg">
          <div className="border-b border-slate-border pb-space-md">
            <h3 className="font-title-editorial text-title-editorial text-deep-obsidian font-semibold mb-2">
              Want an e-commerce experience like this for your business?
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Techvunex Innovations architects high-performance storefronts and hyper-scalable commerce systems for ambitious retail brands.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Signature Capabilities</span>
            {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded bg-surface-container-low border border-slate-border">
                <Icon size={20} className="text-champagne-gold mt-0.5" />
                <div>
                  <h5 className="font-label-md text-label-md font-semibold text-deep-obsidian">{title}</h5>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-space-lg border-t border-slate-border bg-surface-container-low">
          <span className="block w-full py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded text-center font-medium">
            Designed &amp; Developed by Techvunex Innovations
          </span>
        </div>
      </div>
    </>
  );
}
