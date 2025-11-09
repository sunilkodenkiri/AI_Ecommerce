import { autoVendor } from "./vendor.auto";
import { hybridVendor } from "./vendor.hybrid";
import { manualVendor } from "./vendor.manual";
import type { VendorPort } from "@ac/core";

const map: Record<string, VendorPort> = {
  "V-AUTO": autoVendor,
  "V-HYBRID": hybridVendor,
  "V-MANUAL": manualVendor
};

export function getVendorPort(id: string): VendorPort | undefined { return map[id]; }
export const knownVendorIds = Object.keys(map);
