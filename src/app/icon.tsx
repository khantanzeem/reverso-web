import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1F3A",
          borderRadius: 7,
        }}
      >
        {/* Graduation cap, education-themed */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z"
            fill="#00B4D8"
          />
          <path
            d="M5 10.18v4.5c0 1.1 3.13 3.32 7 3.32s7-2.22 7-3.32v-4.5L12 13.5 5 10.18Z"
            fill="#00B4D8"
            opacity="0.6"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
