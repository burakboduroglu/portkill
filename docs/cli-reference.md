# CLI referansı

Özet: [PRD.md](../PRD.md) §5 ile aynıdır; hızlı arama için burada toplanmıştır.

## Kullanım

```bash
portkill <port> [port2] [port3] ...
```

## Seçenekler

| Uzun | Kısa | Açıklama |
| --- | --- | --- |
| `--force` | `-f` | Onay sormadan sonlandır |
| `--dry-run` | `-n` | Süreçleri göster, sonlandırma |
| `--signal <SIG>` | `-s` | Sinyal (varsayılan: SIGTERM); v0.2+ |
| `--verbose` | `-v` | Ayrıntılı çıktı |
| `--version` | — | Sürüm |
| `--help` | `-h` | Yardım |

## Çıktı örnekleri

```
✔ Port 3000 → killed (node, PID 12345)
ℹ Port 8080 → no process found
✖ Port 5432 → permission denied (try with sudo)
```

## Çıkış kodları

| Kod | Anlam |
| --- | --- |
| `0` | Tüm portlar işlendi (başarılı akış) |
| `1` | Genel hata (geçersiz argüman, beklenmeyen hata) |
| `2` | İstenen portlarda hiçbir süreç bulunamadı |
| `3` | İzin hatası (ör. başkasının süreci, düşük port) |

## Örnekler

```bash
portkill 3000
portkill 3000 8080
portkill 3000 --force
portkill 3000 --dry-run
```
