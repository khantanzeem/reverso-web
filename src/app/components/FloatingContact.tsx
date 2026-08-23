import type { SiteSettings } from "@/lib/types";

function digitsOnly(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

export default function FloatingContact({ settings }: { settings: SiteSettings | null }) {
  const whatsapp = settings?.whatsapp ? digitsOnly(settings.whatsapp) : "";
  const phone = settings?.phone2 ? digitsOnly(settings.phone2) : "";

  if (!whatsapp && !phone) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/^\+/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
            <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.65 4.527 1.78 6.396L4 29l7.79-1.744A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.354l-.355-.21-4.62 1.035 1.02-4.5-.232-.368A9.68 9.68 0 0 1 5.25 15c0-5.936 4.818-10.75 10.754-10.75S26.75 9.064 26.75 15 21.94 24.75 16.004 24.75Zm5.55-7.36c-.304-.152-1.797-.887-2.076-.988-.279-.101-.482-.152-.685.152-.203.304-.786.988-.964 1.19-.177.203-.355.228-.659.076-.304-.152-1.283-.473-2.444-1.51-.903-.806-1.513-1.8-1.69-2.104-.178-.304-.019-.469.133-.62.137-.137.304-.355.456-.533.152-.177.203-.304.304-.507.101-.203.05-.38-.025-.532-.076-.152-.685-1.652-.939-2.263-.247-.594-.499-.513-.685-.523l-.583-.01a1.12 1.12 0 0 0-.812.38c-.279.304-1.064 1.04-1.064 2.54s1.089 2.947 1.24 3.15c.152.203 2.145 3.276 5.198 4.593.726.313 1.292.5 1.733.64.728.232 1.39.199 1.914.121.584-.087 1.797-.735 2.05-1.444.253-.71.253-1.318.177-1.444-.076-.126-.279-.203-.583-.355Z" />
          </svg>
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Call us"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-black/20 transition-transform hover:scale-110"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
          </svg>
        </a>
      )}
    </div>
  );
}
