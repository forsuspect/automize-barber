import type { AppointmentStatus } from "@/types";
import { statusLabel } from "@/utils/format";
import styles from "./StatusBadge.module.css";

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
