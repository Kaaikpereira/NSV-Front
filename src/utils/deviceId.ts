// src/utils/deviceId.ts
import { v4 as uuid } from "uuid";

const KEY = "nsv_device_id";

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}