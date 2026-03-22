# DATA_DICTIONARY — portkill

Bu dosya uygulama genelinde kullanılan kavramları, alanları ve (planlı) API yüklerini tek yerde tanımlar. PRD: [PRD.md](./PRD.md).

---

## 1. CLI girdileri

| Alan | Tip | Doğrulama | Açıklama |
| --- | --- | --- | --- |
| `ports` | `number[]` | Her eleman 1–65535 arası tam sayı | Pozisyonel argümanlar; en az bir port gerekir (yardım/version hariç). |
| `force` | `boolean` | — | `--force` / `-f`. |
| `dryRun` | `boolean` | — | `--dry-run` / `-n`. |
| `signal` | `string` | Node/OS tarafından tanınan sinyal adı veya numarası | `--signal` / `-s`; varsayılan `SIGTERM`. |
| `verbose` | `boolean` | — | `--verbose` / `-v`. |

---

## 2. Platform

| Alan | Tip | Değerler | Açıklama |
| --- | --- | --- | --- |
| `platformId` | `string` | `darwin`, `linux` | `process.platform`; diğer değerler desteklenmez (açık hata). |

---

## 3. Süreç / port tespiti (iç model)

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `port` | `number` | Hedef TCP portu. |
| `pid` | `number` | Süreç kimliği; aynı portta birden fazla dinleyici olabilir (liste). |
| `commandName` | `string \| null` | Varsa kısa komut adı (örn. `node`); `lsof`/`ps` çıktısından türetilir. |

**Not:** Birden fazla PID aynı portta dönerse, PRD çıktısı veya implementasyon tek satırda birleştirebilir veya satır başına bir süreç yazabilir; tercih kodda sabitlenmeli ve testle korunmalıdır.

---

## 4. Port işlem sonucu (`PortOutcome`)

Tek bir port için makine tarafında kullanılacak sonuç ayrımı (önerilen isimlendirme):

| `kind` | Anlam | CLI çıktısı (PRD §5.2) | Exit katkısı |
| --- | --- | --- | --- |
| `killed` | Sonlandırma denemesi başarılı | `✔ Port … → killed (name, PID …)` | Başarı |
| `dryRunWouldKill` | Dry-run; süreç vardı | Aynı bilgi + öldürülmedi (metin implementasyonda netleşir) | Başarı |
| `notFound` | Dinleyen süreç yok | `ℹ Port … → no process found` | Toplu `2` için sayım |
| `permissionDenied` | `kill` / EPERM vb. | `✖ Port … → permission denied (try with sudo)` | `3` |
| `error` | Beklenmeyen hata | Uygun hata mesajı | `1` |

İlişkili alanlar (opsiyonel): `pids`, `commandName`, `message` (verbose veya hata detayı).

---

## 5. Çıkış kodu (`ExitCode`)

| Sabit | Değer | Koşul (PRD §5.4) |
| --- | --- | --- |
| `SUCCESS` | `0` | İş akışı tamamlandı; tüm portlar “işlendi” (not_found dahil PRD tanımına göre). |
| `GENERAL_ERROR` | `1` | Geçersiz argüman, iç hata, bilinmeyen hata. |
| `NO_PROCESS_FOUND` | `2` | Hiçbir portta süreç bulunamadı (PRD: tüm portlar boş). |
| `PERMISSION_DENIED` | `3` | En az bir portta izin hatası. |

**Toplama kuralı (öneri):** Öncelik `3` > `1` > `2` > `0`; birden fazla portta farklı sonuçlar varsa en kötü kod kazanır (PRD netleştirilene kadar uygulama README’sinde sabitlenmeli).

---

## 6. Dış komut arayüzleri (referans)

| Platform | Komut | Beklenen kullanım |
| --- | --- | --- |
| macOS | `lsof -ti tcp:<port>` | PID listesi (stdout, satır satır). |
| Linux | `fuser -n tcp <port> 2>/dev/null` veya eşdeğeri | PID listesi; dağıtıma göre parse. |

Bu komutların ham stdout/stderr alanları kalıcı veri modeli değildir; yalnızca `finder` içinde ayrıştırılır.

---

## 7. HTTP API (planlı — GUI, PRD §5.5)

Aşağıdaki şemalar v0.4 öncesi **tasarım**dır; uygulama ile birlikte sürümlenmelidir.

### 7.1 `POST /resolve` isteği

| Alan | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `ports` | `number[]` | evet | Hedef portlar. |
| `dryRun` | `boolean` | hayır | Varsayılan `false`. |
| `force` | `boolean` | hayır | GUI’de onay yoksa anlamlı; varsayılan `false`. |
| `signal` | `string` | hayır | Varsayılan `SIGTERM`. |

### 7.2 `POST /resolve` yanıtı

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `results` | `PortOutcome[]` | Her port için §4 ile uyumlu nesne (serialize edilmiş). |
| `exitCode` | `number` | CLI ile aynı toplama kuralı (isteğe bağlı; UI sadece `results` ile de çizebilir). |

**Güvenlik:** Sunucu yalnızca `127.0.0.1` üzerinde dinlemeli; kimlik doğrulama PRD kapsamı dışında tutulabilir (yerel tek kullanıcı varsayımı).

---

## 8. Sürümleme

| Alan | Konum | Açıklama |
| --- | --- | --- |
| `version` | `package.json` | `--version` çıktısı; npm/Homebrew ile hizalı. |

---

*Son güncelleme: PRD 0.1.0 (2026-03-22) ile uyumlu.*
