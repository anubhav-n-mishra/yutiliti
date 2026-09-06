import type { Metadata } from "next";
import NotFoundClient from "@/src/components/NotFoundClient";

export const metadata: Metadata = {
  title: "404: Page Not Found | Yuitility",
  description: "The requested tool or page does not exist on Yuitility.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
