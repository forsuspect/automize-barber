"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_CREDENTIALS, BRAND } from "@/lib/constants";
import styles from "../admin.module.css";

const schema = z.object({
  username: z.string().min(1, "Informe o usuário"),
  password: z.string().min(1, "Informe a senha"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const onSubmit = async (data: FormData) => {
    setError("");
    setSubmitting(true);
    const ok = await login(data.username, data.password);
    setSubmitting(false);
    if (ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBg} />
      <div className={styles.loginOverlay} />
      <motion.div
        className={styles.loginCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.loginLogo}>
          <h1>{BRAND.name}</h1>
          <p>Painel Administrativo</p>
        </div>

        {error ? <div className={styles.loginError}>{error}</div> : null}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="Usuário"
              placeholder="Usuário"
              error={errors.username?.message}
              {...register("username")}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" fullWidth loading={submitting} size="lg">
              Entrar
            </Button>
          </div>
        </form>

        <Link href="/" className={styles.backToSite}>
          Voltar ao site inicial
        </Link>
      </motion.div>
    </div>
  );
}
