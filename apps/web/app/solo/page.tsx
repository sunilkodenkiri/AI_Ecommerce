"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SoloPage from "@ac/usecase-solo-buy/src/ui/SoloPage";
import { useSoloStore } from "@ac/usecase-solo-buy/src/store/useSoloStore";

export default function SoloRoute() {
  const search = useSearchParams();
  const initialize = useSoloStore((s) => s.initialize);

  const firstOverrides = useMemo(() => {
    const productId = search.get("productId") || undefined;
    const qty = search.get("qty") ? parseInt(search.get("qty")!, 10) : undefined;
    const buyerPrice = search.get("hint") ? parseInt(search.get("hint")!, 10) : undefined;
    const vendorsCsv = search.get("vendors") || "";
    const vendorPool = vendorsCsv.split(",").map((v) => v.trim()).filter(Boolean);
    const ov: any = {};
    if (productId) ov.productId = productId;
    if (qty && !Number.isNaN(qty)) ov.qty = qty;
    if (buyerPrice && !Number.isNaN(buyerPrice)) ov.buyerPrice = buyerPrice;
    if (vendorPool.length > 0) ov.vendorPool = vendorPool;
    return ov;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.toString()]);

  useEffect(() => {
    initialize(2, firstOverrides);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SoloPage />;
}
