import { ImageResponse } from "next/og";
import { TOOLS } from "@/src/types";
import { getCategoryName } from "@/src/lib/site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  const tool = TOOLS.find((t) => t.id === toolId);

  if (!tool) {
    return new Response("Tool not found", { status: 404 });
  }

  const categoryName = getCategoryName(tool.category);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "white",
          padding: "60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.2)",
                fontSize: "28px",
              }}
            >
              🔧
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "14px", opacity: 0.8, textTransform: "uppercase", letterSpacing: "2px" }}>
                {categoryName.toUpperCase()}
              </div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>{tool.title}</div>
            </div>
          </div>

          <div
            style={{
              maxWidth: "900px",
              fontSize: "24px",
              lineHeight: 1.5,
              opacity: 0.95,
            }}
          >
            {tool.description}
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>🔒</span>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>100% Private</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>⚡</span>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>Instant Results</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "50px",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: "20px" }}>🆓</span>
              <span style={{ fontSize: "16px", fontWeight: 600 }}>Free Forever</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            opacity: 0.7,
            marginTop: "auto",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 500 }}>yuitility.app</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.2)",
            }}
          >
            ⚡
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

export const dynamic = "force-dynamic";