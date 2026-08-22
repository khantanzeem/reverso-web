"use client";

import CollectionManager from "../../components/CollectionManager";

export default function AdminStaffingPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Staffing Solutions</h2>
      <p className="mt-1 text-sm text-ink/60">
        The staffing solution cards shown on the homepage and staffing services page.
      </p>
      <div className="mt-6">
        <CollectionManager
          collectionName="staffingSolutions"
          titleKey="title"
          subtitleKey="description"
          defaults={{ active: true }}
          fields={[
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "image", label: "Image URL", type: "url" },
            { key: "order", label: "Order", type: "number" },
            { key: "active", label: "Active", type: "boolean" },
          ]}
        />
      </div>
    </div>
  );
}
