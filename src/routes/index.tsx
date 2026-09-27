import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell, ChevronDown, Clock3, FileArchive, FileImage, FileSpreadsheet, FileText,
  Folder, FolderHeart, Grid2X2, HardDrive, LayoutList, Menu, MoreHorizontal,
  Plus, RotateCcw, Search, Star, Trash2, Upload, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import catWorkspaceAsset from "@/assets/cat-workspace.jpg.asset.json";

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

type Section = "home" | "files" | "recent" | "favorites" | "shared" | "trash";

type DocumentItem = {
  name: string;
  type: string;
  size: string;
  date: string;
  color: string;
  Icon: typeof FileText;
  favorite: boolean;
  shared?: string;
  trashed?: boolean;
};

const folders = [
  { name: "Pekerjaan", count: 24, color: "bg-lilac", Icon: Folder },
  { name: "Personal", count: 18, color: "bg-lime", Icon: FolderHeart },
  { name: "Sertifikat", count: 8, color: "bg-sun", Icon: Star },
];

const files: DocumentItem[] = [
  { name: "Brand Guidelines.pdf", type: "PDF", size: "4.8 MB", date: "Hari ini, 09:42", color: "bg-coral", Icon: FileText, favorite: true, shared: "Tim Desain" },
  { name: "Foto Liburan.zip", type: "ZIP", size: "2.1 GB", date: "Kemarin, 16:20", color: "bg-sun", Icon: FileArchive, favorite: false },
  { name: "Catatan Meeting.docx", type: "DOCX", size: "820 KB", date: "25 Sep 2026", color: "bg-lime", Icon: FileText, favorite: true, shared: "Nadia +2" },
  { name: "Project Plan.docx", type: "DOCX", size: "1.2 MB", date: "24 Sep 2026", color: "bg-sky", Icon: FileText, favorite: false },
  { name: "Budget Q4.xlsx", type: "XLSX", size: "640 KB", date: "22 Sep 2026", color: "bg-lime", Icon: FileSpreadsheet, favorite: true, shared: "Bagas" },
  { name: "Moodboard Produk.png", type: "PNG", size: "8.3 MB", date: "18 Sep 2026", color: "bg-lilac", Icon: FileImage, favorite: false },
  { name: "Proposal Lama.pdf", type: "PDF", size: "3.6 MB", date: "Dihapus 3 hari lalu", color: "bg-coral", Icon: FileText, favorite: false, trashed: true },
  { name: "Screenshot 0920.png", type: "PNG", size: "2.4 MB", date: "Dihapus 6 hari lalu", color: "bg-sky", Icon: FileImage, favorite: false, trashed: true },
];

const navigation: { Icon: typeof Grid2X2; label: string; id: Section }[] = [
  { Icon: Grid2X2, label: "Beranda", id: "home" },
  { Icon: Folder, label: "File saya", id: "files" },
  { Icon: Clock3, label: "Terbaru", id: "recent" },
  { Icon: Star, label: "Favorit", id: "favorites" },
  { Icon: Users, label: "Dibagikan", id: "shared" },
  { Icon: Trash2, label: "Sampah", id: "trash" },
];

const sectionCopy: Record<Exclude<Section, "home">, { eyebrow: string; title: string; description: string }> = {
  files: { eyebrow: "Koleksi pribadi", title: "File saya", description: "Semua dokumen yang kamu simpan, tersusun dalam satu tempat." },
  recent: { eyebrow: "Aktivitas terbaru", title: "Terbaru", description: "Lanjutkan pekerjaan dari file yang baru kamu buka atau ubah." },
  favorites: { eyebrow: "Pilihan penting", title: "Favorit", description: "Akses cepat ke dokumen yang sudah kamu tandai." },
  shared: { eyebrow: "Kerja bersama", title: "Dibagikan", description: "Dokumen yang sedang kamu bagikan dengan orang lain." },
  trash: { eyebrow: "Penyimpanan sementara", title: "Sampah", description: "File akan dihapus permanen setelah 30 hari." },
};

function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [favorites, setFavorites] = useState(files.map((file) => file.favorite));

  const selectSection = (section: Section) => {
    setActiveSection(section);
    setQuery("");
    setSidebarOpen(false);
  };

  const visibleFiles = useMemo(() => {
    const candidates = files.filter((file, index) => {
      if (activeSection === "trash") return file.trashed;
      if (file.trashed) return false;
      if (activeSection === "favorites") return favorites[index];
      if (activeSection === "shared") return Boolean(file.shared);
      if (activeSection === "recent" || activeSection === "home") return index < 4;
      return true;
    });
    return candidates.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeSection, favorites, query]);

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      {sidebarOpen && <Button variant="ghost" aria-label="Tutup menu" className="fixed inset-0 z-30 h-auto w-auto rounded-none border-0 bg-ink/30 p-0 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r-2 border-ink bg-card p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 font-display text-2xl font-bold"><span className="grid size-10 place-items-center rounded-ui border-2 border-ink bg-primary shadow-brutal-sm">P</span>PurrDocs</div>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Tutup navigasi" onClick={() => setSidebarOpen(false)}><X /></Button>
        </div>
        <Button className="w-full"><Plus className="size-5" /> Tambah baru</Button>
        <nav className="mt-8 space-y-2" aria-label="Navigasi utama">
          {navigation.map(({ Icon, label, id }) => {
            const active = activeSection === id;
            return <Button key={id} variant="ghost" aria-current={active ? "page" : undefined} onClick={() => selectSection(id)} className={`h-auto w-full justify-start px-3 py-2.5 ${active ? "border-ink bg-lilac shadow-brutal-sm hover:bg-lilac" : "hover:border-ink"}`}><Icon className="size-5" /> {label}</Button>;
          })}
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
            <Search className="size-5 shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari file atau folder..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
          <Button variant="icon" aria-label="Notifikasi"><Bell className="size-5" /></Button>
          <Button variant="secondary" className="hidden sm:flex"><span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-lime text-xs">FI</span><span className="hidden md:inline">Fasichul</span><ChevronDown className="size-4" /></Button>
        </header>

        <div className="mx-auto max-w-[1500px] p-4 md:p-8">
          {activeSection === "home" ? (
            <>
              <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid min-h-64 overflow-hidden rounded-ui border-2 border-ink bg-lilac shadow-brutal sm:grid-cols-[minmax(0,1.25fr)_minmax(210px,.75fr)]">
                  <div className="relative z-10 p-6 md:p-8">
                    <p className="mb-3 inline-block rounded-full border-2 border-ink bg-card px-3 py-1 text-xs font-bold uppercase">Ruang kerja pribadi</p>
                    <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">Semua dokumenmu,<br />rapi dalam satu tempat.</h1>
                    <p className="mt-4 max-w-md font-medium">Simpan, temukan, dan atur file penting tanpa bikin kepala penuh.</p>
                  </div>
                  <div className="relative min-h-52 border-t-2 border-ink sm:min-h-full sm:border-l-2 sm:border-t-0">
                    <img src={catWorkspaceAsset.url} alt="Kucing oranye bersantai di dekat papan ketik" className="absolute inset-0 size-full object-cover object-[54%_46%]" />
                    <span className="absolute bottom-3 right-3 rounded-ui border-2 border-ink bg-sun px-3 py-1 text-xs font-bold shadow-brutal-sm">OFFICE CAT</span>
                  </div>
                </div>
                <div className="rounded-ui border-2 border-ink bg-lime p-5 shadow-brutal">
                  <p className="text-sm font-bold uppercase">Ringkasan</p><p className="mt-2 font-display text-5xl font-bold">1,248</p><p className="font-semibold">total file tersimpan</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold"><div className="rounded-ui border-2 border-ink bg-card p-3"><FileText className="mb-2 size-5" />738 dokumen</div><div className="rounded-ui border-2 border-ink bg-sky p-3"><FileImage className="mb-2 size-5" />312 gambar</div></div>
                </div>
              </section>
              <section className="mt-10">
                <div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-bold uppercase text-muted-foreground">Akses cepat</p><h2 className="font-display text-2xl font-bold">Folder kamu</h2></div><Button variant="link" onClick={() => selectSection("files")}>Lihat semua</Button></div>
                <div className="grid gap-4 sm:grid-cols-3">{folders.map(({ name, count, color, Icon }) => <Button variant="ghost" key={name} onClick={() => selectSection("files")} className={`group flex h-32 flex-col items-start justify-between border-ink p-4 text-left shadow-brutal-sm hover:-translate-y-1 hover:border-ink hover:${color} ${color}`}><div className="flex w-full justify-between"><Icon className="size-8" /><MoreHorizontal /></div><div><p className="font-display text-xl font-bold">{name}</p><p className="text-sm font-semibold">{count} item</p></div></Button>)}</div>
              </section>
            </>
          ) : (
            <section className="border-b-2 border-ink pb-7">
              <p className="text-sm font-bold uppercase text-muted-foreground">{sectionCopy[activeSection].eyebrow}</p>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-4xl font-bold md:text-5xl">{sectionCopy[activeSection].title}</h1><p className="mt-2 font-medium text-muted-foreground">{sectionCopy[activeSection].description}</p></div><span className="rounded-ui border-2 border-ink bg-sun px-4 py-2 font-bold shadow-brutal-sm">{visibleFiles.length} item</span></div>
            </section>
          )}

          <section className="mt-10">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-sm font-bold uppercase text-muted-foreground">{activeSection === "home" ? "Terakhir dibuka" : "Daftar dokumen"}</p><h2 className="font-display text-2xl font-bold">{activeSection === "home" ? "File terbaru" : sectionCopy[activeSection].title}</h2></div>
              <div className="flex gap-2"><Button variant={view === "list" ? "primary" : "secondary"} size="icon" aria-label="Tampilan daftar" onClick={() => setView("list")}><LayoutList className="size-5" /></Button><Button variant={view === "grid" ? "primary" : "secondary"} size="icon" aria-label="Tampilan grid" onClick={() => setView("grid")}><Grid2X2 className="size-5" /></Button></div>
            </div>
            {visibleFiles.length === 0 ? <div className="rounded-ui border-2 border-dashed border-ink bg-card p-10 text-center"><p className="font-display text-xl font-bold">Belum ada file di sini</p><p className="mt-1 text-sm text-muted-foreground">{query ? `Tidak ada hasil untuk “${query}”.` : "File yang sesuai akan muncul di bagian ini."}</p></div> : (
              <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" : "overflow-hidden rounded-ui border-2 border-ink bg-card shadow-brutal"}>
                {visibleFiles.map((file) => {
                  const originalIndex = files.findIndex((item) => item.name === file.name);
                  return <article key={file.name} className={view === "grid" ? "flex min-h-52 flex-col rounded-ui border-2 border-ink bg-card p-4 shadow-brutal-sm" : "grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b-2 border-ink p-3 last:border-b-0 md:grid-cols-[auto_minmax(0,1.5fr)_100px_100px_160px_auto]"}>
                    <div className={`grid size-11 shrink-0 place-items-center rounded-ui border-2 border-ink ${file.color}`}><file.Icon className="size-6" /></div>
                    <div className={`min-w-0 ${view === "grid" ? "mt-4" : ""}`}><p className="truncate font-bold">{file.name}</p>{view === "grid" && <p className="mt-1 text-sm text-muted-foreground">{file.type} · {file.size}</p>}{file.shared && <p className="mt-1 text-xs font-bold text-muted-foreground">Dibagikan ke {file.shared}</p>}</div>
                    {view === "list" && <><span className="hidden text-sm font-semibold md:block">{file.type}</span><span className="hidden text-sm font-semibold md:block">{file.size}</span><span className="hidden text-sm text-muted-foreground md:block">{file.date}</span></>}
                    <div className={`flex items-center gap-1 ${view === "grid" ? "mt-auto self-end pt-4" : ""}`}>
                      {file.trashed ? <Button variant="ghost" size="icon-sm" aria-label={`Pulihkan ${file.name}`}><RotateCcw className="size-5" /></Button> : <Button variant="ghost" size="icon-sm" aria-label={favorites[originalIndex] ? "Hapus dari favorit" : "Tambahkan ke favorit"} onClick={() => setFavorites((current) => current.map((value, index) => index === originalIndex ? !value : value))} className={favorites[originalIndex] ? "text-coral" : "text-muted-foreground"}><Star className="size-5" fill={favorites[originalIndex] ? "currentColor" : "none"} /></Button>}
                      <Button variant="ghost" size="icon-sm" aria-label={`Menu ${file.name}`}><MoreHorizontal className="size-5" /></Button>
                    </div>
                  </article>;
                })}
              </div>
            )}
          </section>
        </div>
        <Button className="fixed bottom-5 right-5 z-20 md:hidden"><Upload className="size-5" /> Unggah</Button>
      </main>
    </div>
  );
}