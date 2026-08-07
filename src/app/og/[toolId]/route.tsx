import { ImageResponse } from "next/og";
import { TOOLS } from "@/src/types";
import { getCategoryName } from "@/src/lib/site";
import fs from "fs";
import path from "path";

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

  // Load fonts locally to avoid flaky runtime network fetches
  const spaceGroteskPath = path.join(process.cwd(), "public", "fonts", "SpaceGrotesk-Bold.woff");
  const interPath = path.join(process.cwd(), "public", "fonts", "Inter-Medium.woff");
  
  const spaceGroteskData = fs.readFileSync(spaceGroteskPath);
  const interData = fs.readFileSync(interPath);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1200px",
          height: "630px",
          background: "#09090b", // Deep zinc-950 slate black
          color: "white",
          padding: "50px",
          boxSizing: "border-box",
          position: "relative",
          border: "8px solid #18181b", // Outer accent border
        }}
      >
        {/* Soft Radial Brand Color Glowing Highlight */}
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#2563eb",
                boxShadow: "0 0 10px #2563eb",
              }}
            />
            <span
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: "20px",
                letterSpacing: "4px",
                color: "#f4f4f5",
              }}
            >
              YUITILITY.APP
            </span>
          </div>

          <div
            style={{
              padding: "6px 14px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 500,
              color: "#a1a1aa",
              letterSpacing: "1px",
              fontFamily: "Inter",
            }}
          >
            100% CLIENT-SIDE
          </div>
        </div>

        {/* Main Content Layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingLeft: "20px",
            paddingRight: "100px",
            marginTop: "20px",
          }}
        >
          {/* Category Tagline */}
          <span
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: 500,
              color: "#3b82f6", // Neon Blue accent
              textTransform: "uppercase",
              letterSpacing: "4px",
              marginBottom: "12px",
            }}
          >
            {categoryName}
          </span>

          {/* Huge Main Title */}
          <h1
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: "64px",
              lineHeight: 1.15,
              color: "white",
              margin: 0,
              letterSpacing: "-1.5px",
            }}
          >
            {tool.title}
          </h1>

          {/* Clean Editorial Description */}
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "22px",
              lineHeight: 1.5,
              color: "#a1a1aa",
              marginTop: "20px",
              marginBottom: 0,
              maxWidth: "850px",
            }}
          >
            {tool.description}
          </p>
        </div>

        {/* Bottom Metadata & Privacy Badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "11px",
                color: "#71717a",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              [ Local Sandbox ]
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "11px",
                color: "#71717a",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              [ No Server Uploads ]
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "11px",
                color: "#71717a",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              [ Free Forever ]
            </span>
          </div>

          <span
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: "13px",
              color: "#3b82f6",
              letterSpacing: "2px",
            }}
          >
            SECURE UTILITY
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: spaceGroteskData,
          weight: 700,
          style: "normal",
        },
        {
          name: "Inter",
          data: interData,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Ensure nodejs runtime so we can use FS read