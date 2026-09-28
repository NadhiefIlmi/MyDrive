import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — PurrDocs" },
      { name: "description", content: "Masuk ke PurrDocs untuk mengelola dokumen dan catatan pribadimu." },
      { property: "og:title", content: "Masuk — PurrDocs" },
      { property: "og:description", content: "Masuk ke PurrDocs untuk mengelola dokumen dan catatan pribadimu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Masukkan email yang valid.");
    if (password.length < 6) return setError("Kata sandi minimal 6 karakter.");
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-ui border-2 border-ink bg-card shadow-brutal md:grid-cols-2">
        <div className="hidden flex-col justify-between border-r-2 border-ink bg-lilac p-8 md:flex">
          <div className="flex items-center gap-3 font-display text-2xl font-bold"><span className="grid size-10 place-items-center rounded-ui border-2 border-ink bg-primary shadow-brutal-sm">P</span>PurrDocs</div>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight">Dokumen & catatanmu, aman di satu tempat.</h1>
            <p className="mt-4 font-medium">Simpan file, tulis catatan, dan temukan semuanya dalam hitungan detik.</p>
          </div>
          <div className="flex gap-3"><span className="rounded-ui border-2 border-ink bg-sun px-3 py-1 text-xs font-bold shadow-brutal-sm">10 GB GRATIS</span><span className="rounded-ui border-2 border-ink bg-lime px-3 py-1 text-xs font-bold shadow-brutal-sm">CATATAN</span></div>
        </div>
        <form onSubmit={submit} className="p-6 md:p-10">
          <p className="text-sm font-bold uppercase text-muted-foreground">{mode === "login" ? "Selamat datang kembali" : "Mulai gratis"}</p>
          <h2 className="mt-1 font-display text-3xl font-bold">{mode === "login" ? "Masuk" : "Buat akun"}</h2>
          <label className="mt-6 block text-sm font-bold">Email</label>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-ui border-2 border-ink bg-background px-4 shadow-brutal-sm"><Mail className="size-5" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="min-w-0 flex-1 bg-transparent outline-none" /></div>
          <label className="mt-4 block text-sm font-bold">Kata sandi</label>
          <div className="mt-2 flex h-12 items-center gap-3 rounded-ui border-2 border-ink bg-background px-4 shadow-brutal-sm"><Lock className="size-5" /><input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="min-w-0 flex-1 bg-transparent outline-none" /><button type="button" aria-label="Tampilkan kata sandi" onClick={() => setShow(!show)}>{show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>
          {error && <p className="mt-3 rounded-ui border-2 border-ink bg-coral px-3 py-2 text-sm font-bold">{error}</p>}
          <Button type="submit" className="mt-6 w-full">{mode === "login" ? "Masuk" : "Daftar"}</Button>
          <p className="mt-6 text-center text-sm font-medium">{mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"} <button type="button" className="font-bold underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Daftar" : "Masuk"}</button></p>
          <p className="mt-2 text-center text-xs text-muted-foreground"><Link to="/" className="underline">Kembali ke dashboard</Link></p>
        </form>
      </div>
    </div>
  );
}
