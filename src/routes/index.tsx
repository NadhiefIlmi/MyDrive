import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell, ChevronDown, Clock3, FileArchive, FileImage, FileText, Folder,
  FolderHeart, Grid2X2, HardDrive, LayoutList, Menu, MoreHorizontal,
  Plus, Search, Star, Trash2, Upload, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import catAsset from "@/assets/banana-cat.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PurrDocs — Personal Document Manager" },
      { name: "description", content: "Kelola file, folder, dan dokumen pribadi dengan rapi di PurrDocs." },
      { property: "og:title", content: "PurrDocs — Personal Document Manager" },
      { property: "og:description", content: "Kelola file, folder, dan dokumen pribadi dengan rapi di PurrDocs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const folders = [
  { name: "Pekerjaan", count: 24, color: "bg-lilac", Icon: Folder },
  { name: "Personal", count: 18, color: "bg-lime", Icon: FolderHeart },
  { name: "Sertifikat", count: 8, color: "bg-sun", Icon: Star },
];

const files = [
  { name: "Brand Guidelines.pdf", type: "PDF", size: "4.8 MB", date: "Hari ini, 09:42", color: "bg-coral", Icon: FileText, favorite: true },
  { name: "Foto Liburan.zip", type: "ZIP", size: "2.1 MB", date: "Kemarin, 16:20", color: "bg-sun", Icon: FileArchive, favorite: false },
  { name: "Kucing_Pisang.png", type: "PNG", size: "1.4 MB", date: "25 Sep 2026", color: "bg-lime", Icon: FileImage, favorite: true },
  { name: "Project Plan.docx", type: "DOCX", size: "820 KB", date: "24 Sep 2026", color: "bg-sky", Icon: FileText, favorite: false },
];

function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [favorites, setFavorites] = useState(files.map((file) => file.favorite));
  const filteredFiles = useMemo(
    () => files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      {sidebarOpen && <button aria-label="Tutup menu" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r-2 border-ink bg-card p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 font-display text-2xl font-bold">
            <span className="grid size-10 place-items-center rounded-ui border-2 border-ink bg-primary shadow-brutal-sm">P</span>
            PurrDocs
          </div>
          <Button variant="ghost" className="size-10 p-0 lg:hidden" aria-label="Tutup navigasi" onClick={() => setSidebarOpen(false)}><X /></Button>
        </div>
        <Button className="w-full"><Plus className="size-5" /> Tambah baru</Button>
        <nav className="mt-8 space-y-2" aria-label="Navigasi utama">
          {[
            [Grid2X2, "Beranda", true], [Folder, "File saya", false], [Clock3, "Terbaru", false],
            [Star, "Favorit", false], [Users, "Dibagikan", false], [Trash2, "Sampah", false],
          ].map(([Icon, label, active]) => (
            <button key={String(label)} className={`flex w-full items-center gap-3 rounded-ui border-2 px-3 py-2.5 text-left font-semibold ${active ? "border-ink bg-lilac shadow-brutal-sm" : "border-transparent hover:border-ink hover:bg-muted"}`}>
              <Icon className="size-5" /> {String(label)}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-ui border-2 border-ink bg-sun p-4 shadow-brutal-sm">
          <div className="mb-2 flex items-center justify-between font-bold"><span>Storage</span><HardDrive className="size-5" /></div>
          <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-card"><div className="h-full w-[42%] bg-coral" /></div>
          <p className="mt-2 text-sm font-semibold">4.2 GB dari 10 GB</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b-2 border-ink bg-background px-4 md:px-8">
          <Button variant="icon" className="lg:hidden" aria-label="Buka navigasi" onClick={() => setSidebarOpen(true)}><Menu /></Button>
          <label className="flex h-12 min-w-0 max-w-2xl flex-1 items-center gap-3 rounded-ui border-2 border-ink bg-card px-4 shadow-brutal-sm">
            <Search className="size-5 shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari file atau folder..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
          <Button variant="icon" aria-label="Notifikasi"><Bell className="size-5" /></Button>
          <button className="hidden items-center gap-2 rounded-ui border-2 border-ink bg-lime px-3 py-2 font-semibold shadow-brutal-sm sm:flex">
            <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-card text-xs">FI</span>
            <span className="hidden md:inline">Fasichul</span><ChevronDown className="size-4" />
          </button>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 md:p-8">
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative min-h-56 overflow-hidden rounded-ui border-2 border-ink bg-lilac p-6 shadow-brutal md:p-8">
              <div className="relative z-10 max-w-xl">
                <p className="mb-3 inline-block rounded-full border-2 border-ink bg-card px-3 py-1 text-xs font-bold uppercase">Ruang kerja pribadi</p>
                <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">Semua dokumenmu,<br />rapi dalam satu tempat.</h1>
                <p className="mt-4 max-w-md font-medium">Simpan, temukan, dan atur file penting tanpa bikin kepala penuh.</p>
              </div>
              <div className="absolute -bottom-12 right-0 size-52 rotate-3 rounded-full border-2 border-ink bg-sun md:right-8 md:size-64" />
              <img src={catAsset.url} alt="Kucing lucu memakai kostum pisang" className="animate-cat absolute -bottom-4 right-5 z-10 h-44 w-auto object-contain md:right-16 md:h-56" />
            </div>
            <div className="rounded-ui border-2 border-ink bg-lime p-5 shadow-brutal">
              <p className="text-sm font-bold uppercase">Ringkasan</p>
              <p className="mt-2 font-display text-5xl font-bold">1,248</p>
              <p className="font-semibold">total file tersimpan</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
                <div className="rounded-ui border-2 border-ink bg-card p-3"><FileText className="mb-2 size-5" />738 dokumen</div>
                <div className="rounded-ui border-2 border-ink bg-sky p-3"><FileImage className="mb-2 size-5" />312 gambar</div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-bold uppercase text-muted-foreground">Akses cepat</p><h2 className="font-display text-2xl font-bold">Folder kamu</h2></div><button className="font-bold underline decoration-2 underline-offset-4">Lihat semua</button></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {folders.map(({ name, count, color, Icon }) => <button key={name} className={`group flex min-h-32 flex-col items-start justify-between rounded-ui border-2 border-ink p-4 text-left shadow-brutal-sm transition-transform hover:-translate-y-1 ${color}`}><div className="flex w-full justify-between"><Icon className="size-8" /><MoreHorizontal /></div><div><p className="font-display text-xl font-bold">{name}</p><p className="text-sm font-semibold">{count} item</p></div></button>)}
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase text-muted-foreground">Terakhir dibuka</p><h2 className="font-display text-2xl font-bold">File terbaru</h2></div><div className="flex gap-2"><Button variant={view === "list" ? "primary" : "secondary"} className="size-10 p-0" aria-label="Tampilan daftar" onClick={() => setView("list")}><LayoutList className="size-5" /></Button><Button variant={view === "grid" ? "primary" : "secondary"} className="size-10 p-0" aria-label="Tampilan grid" onClick={() => setView("grid")}><Grid2X2 className="size-5" /></Button></div></div>
            {filteredFiles.length === 0 ? <div className="rounded-ui border-2 border-dashed border-ink bg-card p-10 text-center font-bold">Tidak ada file yang cocok dengan “{query}”.</div> : (
              <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" : "overflow-hidden rounded-ui border-2 border-ink bg-card shadow-brutal"}>
                {filteredFiles.map((file) => {
                  const originalIndex = files.findIndex((item) => item.name === file.name);
                  return <article key={file.name} className={view === "grid" ? "rounded-ui border-2 border-ink bg-card p-4 shadow-brutal-sm" : "grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b-2 border-ink p-3 last:border-b-0 md:grid-cols-[auto_minmax(0,1.5fr)_100px_100px_160px_auto]"}>
                    <div className={`grid size-11 place-items-center rounded-ui border-2 border-ink ${file.color}`}><file.Icon className="size-6" /></div>
                    <div className="min-w-0"><p className="truncate font-bold">{file.name}</p>{view === "grid" && <p className="mt-1 text-sm text-muted-foreground">{file.type} · {file.size}</p>}</div>
                    {view === "list" && <><span className="hidden text-sm font-semibold md:block">{file.type}</span><span className="hidden text-sm font-semibold md:block">{file.size}</span><span className="hidden text-sm text-muted-foreground md:block">{file.date}</span></>}
                    <div className="flex items-center gap-1"><button aria-label={favorites[originalIndex] ? "Hapus dari favorit" : "Tambahkan ke favorit"} onClick={() => setFavorites((current) => current.map((value, index) => index === originalIndex ? !value : value))} className={`grid size-9 place-items-center rounded-ui border-2 border-transparent hover:border-ink ${favorites[originalIndex] ? "text-coral" : "text-muted-foreground"}`}><Star className="size-5" fill={favorites[originalIndex] ? "currentColor" : "none"} /></button><button aria-label={`Menu ${file.name}`} className="grid size-9 place-items-center rounded-ui border-2 border-transparent hover:border-ink"><MoreHorizontal className="size-5" /></button></div>
                  </article>;
                })}
              </div>
            )}
          </section>
        </div>
        <button className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-ui border-2 border-ink bg-primary px-5 py-3 font-bold shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none md:hidden"><Upload className="size-5" /> Unggah</button>
      </main>
    </div>
  );
}
