"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SoloPage, useSoloStore } from "@ac/usecase-solo-buy";

function parseNumber(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

export default function SoloRoute() {
  const search = useSearchParams();
  const initialize = useSoloStore((s) => s.initialize);

  const firstOverrides = useMemo(() => {
    const productId = search.get("productId") || undefined;
    const qty = parseNumber(search.get("qty"));
    const buyerPrice = parseNumber(search.get("hint"));
    const vendorsCsv = search.get("vendors") || "";
    const vendorPool = vendorsCsv
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    const ov: Partial<any> = {};
    if (productId) ov.productId = productId;
    if (typeof qty === "number") ov.qty = Math.max(1, qty);
    if (typeof buyerPrice === "number") ov.buyerPrice = Math.max(0, buyerPrice);
    if (vendorPool.length > 0) ov.vendorPool = vendorPool;
    return ov;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.toString()]);

  useEffect(() => {
    // Initialize with 2 default sessions unless the caller wants a different count
    initialize(2, firstOverrides);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SoloPage />;
}