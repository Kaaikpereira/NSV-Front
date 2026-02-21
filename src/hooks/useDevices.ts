// src/hooks/useDevices.ts
import { useEffect, useState } from "react";
import { fetchDevices, revokeDevice, DeviceSession } from "@/api/securityClient";
import { getDeviceId } from "@/utils/deviceId";

export interface UiDeviceSession extends DeviceSession {
  is_current: boolean;
  nice_name: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<UiDeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function buildNiceName(device: DeviceSession): string {
    const ua = device.user_agent || "";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS X")) return "macOS";
    return device.device_name || "Dispositivo";
  }

  async function refresh() {
    try {
      setLoading(true);
      const data = await fetchDevices();
      const currentId = getDeviceId();

      const mapped: UiDeviceSession[] = data.map((d) => ({
        ...d,
        is_current: d.device_id === currentId,
        nice_name: buildNiceName(d),
      }));

      setDevices(mapped);
      setError(null);
    } catch (err) {
      console.error("[useDevices] error", err);
      setError("Não foi possível carregar os dispositivos conectados.");
    } finally {
      setLoading(false);
    }
  }

  async function revoke(id: string) {
    await revokeDevice(id);
    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return { devices, loading, error, refresh, revoke };
}