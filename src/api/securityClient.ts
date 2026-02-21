// src/api/securityClient.ts
import { apiClient } from "@/api/client";

export interface DeviceSession {
  id: string;
  device_id: string;
  device_name: string;
  user_agent: string;
  ip: string | null;
  created_at: string;
  last_seen_at: string;
  is_current: boolean;
  token?: string;
}

export async function fetchDevices() {
  const res = await apiClient<{ devices: DeviceSession[] }>("/security/devices");
  return res.devices;
}

export async function revokeDevice(id: string) {
  await apiClient<void>(`/security/devices/${id}`, {
    method: "DELETE",
  });
}
