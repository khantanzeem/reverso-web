"use client";

import CollectionManager from "../../components/CollectionManager";

export default function AdminBannersPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Hero Banners</h2>
      <p className="mt-1 text-sm text-ink/60">Slides shown in the homepage hero carousel.</p>
      <div className="mt-6">
        <CollectionManager
          collectionName="banners"
          titleKey="heading"
          subtitleKey="ctaText"
          defaults={{ active: true }}
          fields={[
            { key: "heading", label: "Heading", type: "text" },
            { key: "image", label: "Image URL", type: "url" },
            { key: "ctaText", label: "Button text", type: "text" },
            { key: "ctaLink", label: "Button link", type: "text" },
            { key: "order", label: "Order", type: "number" },
            { key: "active", label: "Active", type: "boolean" },
          ]}
        />
      </div>
    </div>
  );
}
