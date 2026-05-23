"use client";

import { CheckCheck } from "lucide-react";
import styles from "./ConfirmationMessage.module.css";

interface ConfirmationMessageProps {
  clientPhone: string;
  delivered: boolean;
}

export function ConfirmationMessage({
  clientPhone,
  delivered,
}: ConfirmationMessageProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.channel}>
        {delivered ? (
          <>
            <CheckCheck size={16} className={styles.sentIcon} />
            Mensagem enviada para <strong>{clientPhone}</strong>
          </>
        ) : (
          <>Enviando confirmação para <strong>{clientPhone}</strong>...</>
        )}
      </p>
    </div>
  );
}
