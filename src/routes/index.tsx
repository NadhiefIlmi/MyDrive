import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, ChevronDown, Clock3, FileArchive, FileImage, FileSpreadsheet, FileText,
  Folder, FolderHeart, FolderPlus, Grid2X2, HardDrive, LayoutList, LogOut, Menu, MoreHorizontal,
  Monitor, Moon, Plus, RotateCcw, Search, Settings, StickyNote, Star, Sun, Trash2, Upload, User, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import catWorkspaceAsset from "@/assets/cat-workspace.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PurrDocs — Personal Document Manager" },
      { name: "description", content: "Kelola file, folder, catatan, dan dokumen pribadi dengan rapi di PurrDocs." },
      { property: "og:title", content: "PurrDocs — Personal Document Manager" },
      { property: "og:description", content: "Kelola file, folder, catatan, dan dokumen pribadi dengan rapi di PurrDocs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Section = "home" | "files" | "recent" | "favorites" | "notes" | "trash" | "storage" | "settings";
type Theme = "light" | "dark" | "system";

type DocumentItem = {
  id: number; name: string; type: string; size: string; date: string; color: string;
  Icon: typeof FileText; favorite: boolean; trashed?: boolean;
};
type Note = { id: number; title: string; body: string; color: string; date: string };

const initialFolders = [
  { name: "Pekerjaan", count: 24, color: "bg-lilac", Icon: Folder },
  { name: "Personal", count: 18, color: "bg-lime", Icon: FolderHeart },
  { name: "Sertifikat", count: 8, color: "bg-sun", Icon: Star },
];

const initialFiles: DocumentItem[] = [
  { id: 1, name: "Brand Guidelines.pdf", type: "PDF", size: "4.8 MB", date: "Hari ini, 09:42", color: "bg-coral", Icon: FileText, favorite: true },
  { id: 2, name: "Foto Liburan.zip", type: "ZIP", size: "2.1 GB", date: "Kemarin, 16:20", color: "bg-sun", Icon: FileArchive, favorite: false },
  { id: 3, name: "Catatan Meeting.docx", type: "DOCX", size: "820 KB", date: "25 Sep 2026", color: "bg-lime", Icon: FileText, favorite: true },
  { id: 4, name: "Project Plan.docx", type: "DOCX", size: "1.2 MB", date: "24 Sep 2026", color: "bg-sky", Icon: FileText, favorite: false },
  { id: 5, name: "Budget Q4.xlsx", type: "XLSX", size: "640 KB", date: "22 Sep 2026", color: "bg-lime", Icon: FileSpreadsheet, favorite: true },
  { id: 6, name: "Moodboard Produk.png", type: "PNG", size: "8.3 MB", date: "18 Sep 2026", color: "bg-lilac", Icon: FileImage, favorite: false },
  { id: 7, name: "Proposal Lama.pdf", type: "PDF", size: "3.6 MB", date: "Dihapus 3 hari lalu", color: "bg-coral", Icon: FileText, favorite: false, trashed: true },
  { id: 8, name: "Screenshot 0920.png", type: "PNG", size: "2.4 MB", date: "Dihapus 6 hari lalu", color: "bg-sky", Icon: FileImage, favorite: false, trashed: true },
];

const initialNotes: Note[] = [
  { id: 1, title: "Ide konten minggu ini", body: "Tulis panduan menyusun folder kerja dan tips arsip digital.", color: "bg-sun", date: "Hari ini" },
  { id: 2, title: "Belanja bulanan", body: "Kopi, makanan kucing, kertas A4, baterai.", color: "bg-lime", date: "Kemarin" },
  { id: 3, title: "Rapat klien", body: "Kirim revisi proposal sebelum Jumat jam 15.00.", color: "bg-lilac", date: "25 Sep" },
];

const noteColors = ["bg-sun", "bg-lime", "bg-lilac", "bg-sky", "bg-coral"];

const navigation: { Icon: typeof Grid2X2; label: string; id: Section }[] = [
  { Icon: Grid2X2, label: "Beranda", id: "home" },
  { Icon: Folder, label: "File saya", id: "files" },
  { Icon: Clock3, label: "Terbaru", id: "recent" },
  { Icon: Star, label: "Favorit", id: "favorites" },
  { Icon: StickyNote, label: "Catatan", id: "notes" },
  { Icon: Trash2, label: "Sampah", id: "trash" },
];

const sectionCopy: Record<Exclude<Section, "home">, { eyebrow: string; title: string; description: string }> = {
  files: { eyebrow: "Koleksi pribadi", title: "File saya", description: "Semua dokumen yang kamu simpan, tersusun dalam satu tempat." },
  recent: { eyebrow: "Aktivitas terbaru", title: "Terbaru", description: "Lanjutkan pekerjaan dari file yang baru kamu buka atau ubah." },
  favorites: { eyebrow: "Pilihan penting", title: "Favorit", description: "Akses cepat ke dokumen yang sudah kamu tandai." },
  notes: { eyebrow: "Tulis cepat", title: "Catatan", description: "Simpan ide, daftar tugas, dan pengingat pribadimu." },
  trash: { eyebrow: "Penyimpanan sementara", title: "Sampah", description: "File akan dihapus permanen setelah 30 hari." },
  storage: { eyebrow: "Kapasitas akun", title: "Penyimpanan", description: "Lihat apa saja yang memakai ruang penyimpananmu." },
  settings: { eyebrow: "Preferensi akun", title: "Pengaturan", description: "Atur tampilan PurrDocs agar nyaman untukmu." },
};

const themeOptions: { id: Theme; label: string; description: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Light", description: "Tampilan terang setiap saat", Icon: Sun },
  { id: "dark", label: "Dark", description: "Tampilan gelap setiap saat", Icon: Moon },
  { id: "system", label: "System", description: "Ikuti pengaturan perangkat", Icon: Monitor },
];

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && prefersDark));
  document.documentElement.style.colorScheme = theme === "system" ? "light dark" : theme;
}

const storageBreakdown = [
  { label: "Dokumen", size: "1.4 GB", pct: 14, color: "bg-lilac", Icon: FileText },
  { label: "Gambar", size: "1.6 GB", pct: 16, color: "bg-sky", Icon: FileImage },
  { label: "Arsip", size: "1.0 GB", pct: 10, color: "bg-sun", Icon: FileArchive },
  { label: "Lainnya", size: "0.2 GB", pct: 2, color: "bg-coral", Icon: Folder },
];

function formatSize(bytes: number) {
  if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}

function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState(initialFolders);
  const [notes, setNotes] = useState(initialNotes);
  const [theme, setTheme] = useState<Theme>("system");
  const [openMenu, setOpenMenu] = useState<null | "add" | "theme" | "profile">(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [toast, setToast] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const toggleMenu = (m: "add" | "theme" | "profile") => setOpenMenu((c) => (c === m ? null : m));

  useEffect(() => {
    const saved = window.localStorage.getItem("purrdocs-theme");
    const initialTheme: Theme = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => applyTheme("system");
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [theme]);

  const chooseTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    window.localStorage.setItem("purrdocs-theme", nextTheme);
    applyTheme(nextTheme);
  };

  const selectSection = (section: Section) => {
    setActiveSection(section); setQuery(""); setSidebarOpen(false); setOpenMenu(null);
  };

  const newNote = () => {
    const note: Note = { id: Date.now(), title: "", body: "", color: noteColors[notes.length % noteColors.length]!, date: "Baru saja" };
    selectSection("notes");
    setEditingNote(note);
  };
  const saveNote = () => {
    if (!editingNote) return;
    const n = { ...editingNote, title: editingNote.title.trim() || "Tanpa judul", date: "Baru saja" };
    setNotes((c) => (c.some((x) => x.id === n.id) ? c.map((x) => (x.id === n.id ? n : x)) : [n, ...c]));
    setEditingNote(null); flash("Catatan disimpan");
  };

  const onUpload = (list: FileList | null) => {
    if (!list?.length) return;
    const added: DocumentItem[] = Array.from(list).map((f, i) => {
      const ext = (f.name.split(".").pop() || "FILE").toUpperCase();
      const isImg = f.type.startsWith("image/");
      return { id: Date.now() + i, name: f.name, type: ext, size: formatSize(f.size), date: "Baru saja", color: isImg ? "bg-lilac" : "bg-sky", Icon: isImg ? FileImage : FileText, favorite: false };
    });
    setFiles((c) => [...added, ...c]);
    setOpenMenu(null); flash(`${added.length} file ditambahkan`);
  };

  const newFolder = () => {
    const name = window.prompt("Nama folder baru", "Folder baru");
    setOpenMenu(null);
    if (!name?.trim()) return;
    setFolders((c) => [...c, { name: name.trim(), count: 0, color: noteColors[c.length % noteColors.length]!, Icon: Folder }]);
    flash(`Folder "${name.trim()}" dibuat`);
  };

  const updateFile = (id: number, patch: Partial<DocumentItem>) => setFiles((c) => c.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const visibleFiles = useMemo(() => {
    const active = files.filter((f) => !f.trashed);
    const candidates = activeSection === "trash" ? files.filter((f) => f.trashed)
      : activeSection === "favorites" ? active.filter((f) => f.favorite)
      : activeSection === "recent" || activeSection === "home" ? active.slice(0, 4)
      : active;
    return candidates.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeSection, files, query]);

  const visibleNotes = notes.filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(query.toLowerCase()));
  const headerCount = activeSection === "notes" ? visibleNotes.length : visibleFiles.length;

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => { onUpload(e.target.files); e.target.value = ""; }} />
      {sidebarOpen && <Button variant="ghost" aria-label="Tutup menu" className="fixed inset-0 z-30 h-auto w-auto rounded-none border-0 bg-ink/30 p-0 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {openMenu && <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r-2 border-ink bg-card p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 font-display text-2xl font-bold"><span className="grid size-10 place-items-center rounded-ui border-2 border-ink bg-primary shadow-brutal-sm">P</span>PurrDocs</div>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Tutup navigasi" onClick={() => setSidebarOpen(false)}><X /></Button>
        </div>
        <div className="relative z-30">
          <Button className="w-full" onClick={() => toggleMenu("add")}><Plus className="size-5" /> Tambah baru</Button>
          {openMenu === "add" && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-ui border-2 border-ink bg-card p-2 shadow-brutal">
              <MenuItem Icon={Upload} label="Unggah file" onClick={() => fileInput.current?.click()} />
              <MenuItem Icon={FolderPlus} label="Folder baru" onClick={newFolder} />
              <MenuItem Icon={StickyNote} label="Catatan baru" onClick={newNote} />
            </div>
          )}
        </div>
        <nav className="mt-8 space-y-2" aria-label="Navigasi utama">
          {navigation.map(({ Icon, label, id }) => {
            const active = activeSection === id;
            return <Button key={id} variant="ghost" aria-current={active ? "page" : undefined} onClick={() => selectSection(id)} className={`h-auto w-full justify-start px-3 py-2.5 ${active ? "border-ink bg-lilac shadow-brutal-sm hover:bg-lilac" : "hover:border-ink"}`}><Icon className="size-5" /> {label}</Button>;
          })}
        </nav>
        <button onClick={() => selectSection("storage")} className={`mt-auto rounded-ui border-2 border-ink bg-sun p-4 text-left shadow-brutal-sm transition-transform hover:-translate-y-1 ${activeSection === "storage" ? "ring-2 ring-ink ring-offset-2" : ""}`}>
          <div className="mb-2 flex items-center justify-between font-bold"><span>Storage</span><HardDrive className="size-5" /></div>
          <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-card"><div className="h-full w-[42%] bg-coral" /></div>
          <p className="mt-2 text-sm font-semibold">4.2 GB dari 10 GB</p>
        </button>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b-2 border-ink bg-background px-4 md:px-8">
          <Button variant="icon" className="lg:hidden" aria-label="Buka navigasi" onClick={() => setSidebarOpen(true)}><Menu /></Button>
          <label className="flex h-12 min-w-0 max-w-2xl flex-1 items-center gap-3 rounded-ui border-2 border-ink bg-card px-4 shadow-brutal-sm">
            <Search className="size-5 shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={activeSection === "notes" ? "Cari catatan..." : "Cari file atau folder..."} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
          <div className="relative z-30">
            <Button variant="icon" aria-label="Pilih tema" title="Pilih tema" onClick={() => toggleMenu("theme")}>
              {theme === "light" ? <Sun className="size-5" /> : theme === "dark" ? <Moon className="size-5" /> : <Monitor className="size-5" />}
            </Button>
            {openMenu === "theme" && (
              <div className="absolute right-0 top-full mt-3 w-72 max-w-[85vw] rounded-ui border-2 border-ink bg-card p-2 shadow-brutal">
                <p className="border-b-2 border-ink px-3 pb-2 font-display font-bold">Dark Mode</p>
                {themeOptions.map(({ id, label, description, Icon }) => (
                  <Button key={id} variant="ghost" onClick={() => { chooseTheme(id); setOpenMenu(null); }} className="mt-1 h-auto w-full justify-start px-3 py-2 text-left">
                    <Icon className="size-5 shrink-0" /><span className="min-w-0 flex-1"><span className="block font-bold">{label}</span><span className="block text-xs font-medium text-muted-foreground">{description}</span></span>{theme === id && <Check className="size-5 shrink-0" />}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="relative z-30">
            <Button variant="secondary" onClick={() => toggleMenu("profile")}><span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-lime text-xs">FI</span><span className="hidden md:inline">Fasichul</span><ChevronDown className="size-4" /></Button>
            {openMenu === "profile" && (
              <div className="absolute right-0 top-full mt-3 w-60 rounded-ui border-2 border-ink bg-card p-2 shadow-brutal">
                <div className="border-b-2 border-ink px-3 pb-2"><p className="font-bold">Fasichul Ilmi</p><p className="text-xs text-muted-foreground">fasichul@email.com</p></div>
                <MenuItem Icon={User} label="Profil saya" onClick={() => { setOpenMenu(null); flash("Halaman profil segera hadir"); }} />
                <MenuItem Icon={Settings} label="Pengaturan" onClick={() => selectSection("settings")} />
                <MenuItem Icon={HardDrive} label="Penyimpanan" onClick={() => selectSection("storage")} />
                <Link to="/login" className="flex w-full items-center gap-3 rounded-ui px-3 py-2 text-sm font-semibold text-left hover:bg-coral"><LogOut className="size-4" /> Keluar</Link>
              </div>
            )}
          </div>
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
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold"><div className="rounded-ui border-2 border-ink bg-card p-3"><FileText className="mb-2 size-5" />738 dokumen</div><button onClick={() => selectSection("notes")} className="rounded-ui border-2 border-ink bg-sky p-3 text-left"><StickyNote className="mb-2 size-5" />{notes.length} catatan</button></div>
                </div>
              </section>
              <section className="mt-10">
                <div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-bold uppercase text-muted-foreground">Akses cepat</p><h2 className="font-display text-2xl font-bold">Folder kamu</h2></div><Button variant="link" onClick={() => selectSection("files")}>Lihat semua</Button></div>
                <div className="grid gap-4 sm:grid-cols-3">{folders.map(({ name, count, color, Icon }) => <Button variant="ghost" key={name} onClick={() => selectSection("files")} className={`group flex h-32 flex-col items-start justify-between border-ink p-4 text-left shadow-brutal-sm hover:-translate-y-1 hover:border-ink ${color} hover:${color}`}><div className="flex w-full justify-between"><Icon className="size-8" /><MoreHorizontal /></div><div><p className="font-display text-xl font-bold">{name}</p><p className="text-sm font-semibold">{count} item</p></div></Button>)}</div>
              </section>
            </>
          ) : (
            <section className="border-b-2 border-ink pb-7">
              <p className="text-sm font-bold uppercase text-muted-foreground">{sectionCopy[activeSection].eyebrow}</p>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-4xl font-bold md:text-5xl">{sectionCopy[activeSection].title}</h1><p className="mt-2 font-medium text-muted-foreground">{sectionCopy[activeSection].description}</p></div>
                {activeSection === "notes" ? <Button onClick={newNote}><Plus className="size-5" /> Catatan baru</Button> : activeSection !== "storage" && <span className="rounded-ui border-2 border-ink bg-sun px-4 py-2 font-bold shadow-brutal-sm">{headerCount} item</span>}
              </div>
            </section>
          )}

          {activeSection === "settings" ? (
            <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-ui border-2 border-ink bg-card p-6 shadow-brutal">
                <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-ui border-2 border-ink bg-lilac"><Sun className="size-6" /></span><div><h2 className="font-display text-2xl font-bold">Tampilan</h2><p className="text-sm font-medium text-muted-foreground">Pilih tema untuk seluruh aplikasi.</p></div></div>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {themeOptions.map(({ id, label, description, Icon }) => (
                    <Button key={id} variant="ghost" onClick={() => chooseTheme(id)} aria-pressed={theme === id} className={`relative h-auto min-h-36 flex-col items-start justify-between border-ink p-4 text-left ${theme === id ? "bg-lilac shadow-brutal-sm hover:bg-lilac" : "bg-background hover:border-ink"}`}>
                      <div className="flex w-full items-center justify-between"><Icon className="size-7" />{theme === id && <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-lime"><Check className="size-4" /></span>}</div>
                      <div><span className="block font-display text-xl font-bold">{label}</span><span className="mt-1 block text-xs font-medium text-muted-foreground">{description}</span></div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="rounded-ui border-2 border-ink bg-sun p-5 shadow-brutal-sm"><Monitor className="size-7" /><p className="mt-3 font-display text-xl font-bold">Tema aktif: {themeOptions.find((option) => option.id === theme)?.label}</p><p className="mt-1 text-sm font-medium">Pilihan ini tersimpan dan digunakan lagi saat kamu membuka PurrDocs.</p></div>
            </section>
          ) : activeSection === "storage" ? (
            <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-ui border-2 border-ink bg-card p-6 shadow-brutal">
                <p className="font-display text-5xl font-bold">4.2 GB</p><p className="font-semibold text-muted-foreground">terpakai dari 10 GB</p>
                <div className="mt-6 flex h-6 overflow-hidden rounded-full border-2 border-ink bg-background">{storageBreakdown.map((s) => <div key={s.label} className={`${s.color} border-r-2 border-ink`} style={{ width: `${s.pct}%` }} />)}</div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">{storageBreakdown.map(({ label, size, color, Icon }) => <div key={label} className="flex items-center gap-3 rounded-ui border-2 border-ink p-3"><span className={`grid size-10 place-items-center rounded-ui border-2 border-ink ${color}`}><Icon className="size-5" /></span><div><p className="font-bold">{label}</p><p className="text-sm text-muted-foreground">{size}</p></div></div>)}</div>
              </div>
              <div className="space-y-5">
                <div className="rounded-ui border-2 border-ink bg-lilac p-5 shadow-brutal"><p className="text-sm font-bold uppercase">Upgrade</p><p className="mt-1 font-display text-2xl font-bold">PurrDocs Pro</p><p className="mt-1 text-sm font-medium">100 GB penyimpanan & riwayat versi.</p><Button className="mt-4 w-full" onClick={() => flash("Paket Pro segera hadir")}>Lihat paket</Button></div>
                <div className="rounded-ui border-2 border-ink bg-card p-5 shadow-brutal-sm"><p className="font-bold">Bersihkan ruang</p><p className="mt-1 text-sm text-muted-foreground">{files.filter((f) => f.trashed).length} file di sampah memakai 6.0 MB.</p><Button variant="secondary" className="mt-4 w-full" onClick={() => selectSection("trash")}>Buka sampah</Button></div>
              </div>
            </section>
          ) : activeSection === "notes" ? (
            <section className="mt-10">
              {visibleNotes.length === 0 ? <div className="rounded-ui border-2 border-dashed border-ink bg-card p-10 text-center"><p className="font-display text-xl font-bold">Belum ada catatan</p><p className="mt-1 text-sm text-muted-foreground">{query ? `Tidak ada hasil untuk “${query}”.` : "Klik “Catatan baru” untuk mulai menulis."}</p></div> : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleNotes.map((n) => (
                  <article key={n.id} className={`flex min-h-48 flex-col rounded-ui border-2 border-ink p-5 shadow-brutal-sm ${n.color}`}>
                    <button className="flex-1 text-left" onClick={() => setEditingNote(n)}><p className="font-display text-xl font-bold">{n.title}</p><p className="mt-2 whitespace-pre-line text-sm font-medium">{n.body}</p></button>
                    <div className="mt-4 flex items-center justify-between"><span className="text-xs font-bold">{n.date}</span><Button variant="ghost" size="icon-sm" aria-label={`Hapus ${n.title}`} onClick={() => { setNotes((c) => c.filter((x) => x.id !== n.id)); flash("Catatan dihapus"); }}><Trash2 className="size-4" /></Button></div>
                  </article>
                ))}</div>
              )}
            </section>
          ) : (
            <section className="mt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-sm font-bold uppercase text-muted-foreground">{activeSection === "home" ? "Terakhir dibuka" : "Daftar dokumen"}</p><h2 className="font-display text-2xl font-bold">{activeSection === "home" ? "File terbaru" : sectionCopy[activeSection].title}</h2></div>
                <div className="flex gap-2"><Button variant={view === "list" ? "primary" : "secondary"} size="icon" aria-label="Tampilan daftar" onClick={() => setView("list")}><LayoutList className="size-5" /></Button><Button variant={view === "grid" ? "primary" : "secondary"} size="icon" aria-label="Tampilan grid" onClick={() => setView("grid")}><Grid2X2 className="size-5" /></Button></div>
              </div>
              {visibleFiles.length === 0 ? <div className="rounded-ui border-2 border-dashed border-ink bg-card p-10 text-center"><p className="font-display text-xl font-bold">Belum ada file di sini</p><p className="mt-1 text-sm text-muted-foreground">{query ? `Tidak ada hasil untuk “${query}”.` : "File yang sesuai akan muncul di bagian ini."}</p></div> : (
                <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" : "overflow-hidden rounded-ui border-2 border-ink bg-card shadow-brutal"}>
                  {visibleFiles.map((file) => (
                    <article key={file.id} className={view === "grid" ? "flex min-h-52 flex-col rounded-ui border-2 border-ink bg-card p-4 shadow-brutal-sm" : "grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b-2 border-ink p-3 last:border-b-0 md:grid-cols-[auto_minmax(0,1.5fr)_100px_100px_160px_auto]"}>
                      <div className={`grid size-11 shrink-0 place-items-center rounded-ui border-2 border-ink ${file.color}`}><file.Icon className="size-6" /></div>
                      <div className={`min-w-0 ${view === "grid" ? "mt-4" : ""}`}><p className="truncate font-bold">{file.name}</p>{view === "grid" && <p className="mt-1 text-sm text-muted-foreground">{file.type} · {file.size}</p>}</div>
                      {view === "list" && <><span className="hidden text-sm font-semibold md:block">{file.type}</span><span className="hidden text-sm font-semibold md:block">{file.size}</span><span className="hidden text-sm text-muted-foreground md:block">{file.date}</span></>}
                      <div className={`flex items-center gap-1 ${view === "grid" ? "mt-auto self-end pt-4" : ""}`}>
                        {file.trashed ? <Button variant="ghost" size="icon-sm" aria-label={`Pulihkan ${file.name}`} onClick={() => { updateFile(file.id, { trashed: false, date: "Dipulihkan" }); flash("File dipulihkan"); }}><RotateCcw className="size-5" /></Button> : <Button variant="ghost" size="icon-sm" aria-label={file.favorite ? "Hapus dari favorit" : "Tambahkan ke favorit"} onClick={() => updateFile(file.id, { favorite: !file.favorite })} className={file.favorite ? "text-coral" : "text-muted-foreground"}><Star className="size-5" fill={file.favorite ? "currentColor" : "none"} /></Button>}
                        <Button variant="ghost" size="icon-sm" aria-label={file.trashed ? `Hapus permanen ${file.name}` : `Buang ${file.name}`} onClick={() => { if (file.trashed) { setFiles((c) => c.filter((f) => f.id !== file.id)); flash("File dihapus permanen"); } else { updateFile(file.id, { trashed: true, date: "Dihapus baru saja" }); flash("File dipindahkan ke sampah"); } }}><Trash2 className="size-5" /></Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
        <Button className="fixed bottom-5 right-5 z-20 md:hidden" onClick={() => fileInput.current?.click()}><Upload className="size-5" /> Unggah</Button>
      </main>

      {editingNote && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setEditingNote(null)}>
          <div className={`w-full max-w-lg rounded-ui border-2 border-ink p-5 shadow-brutal ${editingNote.color}`} onClick={(e) => e.stopPropagation()}>
            <input autoFocus value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} placeholder="Judul catatan" className="w-full bg-transparent font-display text-2xl font-bold outline-none placeholder:text-ink/50" />
            <textarea value={editingNote.body} onChange={(e) => setEditingNote({ ...editingNote, body: e.target.value })} placeholder="Tulis sesuatu..." rows={7} className="mt-3 w-full resize-none rounded-ui border-2 border-ink bg-card p-3 outline-none" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">{noteColors.map((c) => <button key={c} aria-label={`Warna ${c}`} onClick={() => setEditingNote({ ...editingNote, color: c })} className={`size-7 rounded-full border-2 border-ink ${c} ${editingNote.color === c ? "ring-2 ring-ink ring-offset-2" : ""}`} />)}</div>
              <div className="flex gap-2"><Button variant="secondary" onClick={() => setEditingNote(null)}>Batal</Button><Button onClick={saveNote}>Simpan</Button></div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-ui border-2 border-ink bg-lime px-4 py-2 font-bold shadow-brutal-sm md:bottom-6">{toast}</div>}
    </div>
  );
}

function MenuItem({ Icon, label, onClick }: { Icon: typeof FileText; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-ui px-3 py-2 text-left text-sm font-semibold hover:bg-sun"><Icon className="size-4" /> {label}</button>;
}
