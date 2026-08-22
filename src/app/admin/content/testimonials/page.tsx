"use client";

import CollectionManager from "../../components/CollectionManager";

export default function AdminTestimonialsPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Testimonials</h2>
      <p className="mt-1 text-sm text-ink/60">Shown in the "What people say" section on the homepage.</p>
      <div className="mt-6">
        <CollectionManager
          collectionName="testimonials"
          titleKey="name"
          subtitleKey="quote"
          fields={[
            { key: "name", label: "Name", type: "text" },
            { key: "photo", label: "Photo URL", type: "url" },
            { key: "heading", label: "Heading", type: "text" },
            { key: "quote", label: "Quote", type: "textarea" },
            { key: "order", label: "Order", type: "number" },
          ]}
        />
      </div>
    </div>
  );
}
