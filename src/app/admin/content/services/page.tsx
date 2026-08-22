"use client";

import CollectionManager from "../../components/CollectionManager";

export default function AdminServicesPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Services</h2>
      <p className="mt-1 text-sm text-ink/60">
        The 3 core services shown on the homepage and /services. Slugs must stay
        training-and-placement, staffing-services, and web-solutions to match their detail pages.
      </p>
      <div className="mt-6">
        <CollectionManager
          collectionName="services"
          titleKey="title"
          subtitleKey="slug"
          defaults={{ active: true }}
          fields={[
            { key: "title", label: "Title", type: "text" },
            { key: "slug", label: "Slug", type: "text" },
            { key: "excerpt", label: "Excerpt", type: "textarea" },
            { key: "bodyHtml", label: "Body HTML", type: "textarea" },
            { key: "image", label: "Image URL", type: "url" },
            { key: "order", label: "Order", type: "number" },
            { key: "active", label: "Active", type: "boolean" },
          ]}
        />
      </div>
    </div>
  );
}
