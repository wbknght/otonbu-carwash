## Görev: Carwash System için Kanban Board UI Geliştir

### Proje Bilgisi
- **Proje**: Otonbu Carwash System (Araba yıkama sistemi)
- **Teknoloji Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase
- **Dizin**: `/Users/sezeryasar/.openclaw/workspace/carwash-system/apps/web/`

### Mevcut Durum
- Database schema tamamlandı ve seed edildi
- Jobs model: `JobStatus` enum = 'waiting', 'washing', 'detailing', 'ready_for_pickup', 'payment_pending', 'completed'
- Backend endpoint'leri:
  - GET `/api/jobs` - çalışıyor
  - PATCH `/api/jobs/[id]` - geliştiriliyor (status güncelleme için)
- Next.js dev server `localhost:3000`'de çalışıyor

### Gereksinim
**Kanban Board UI Component'i oluştur**:
1. **Dosya yolu**: `/carwash-system/apps/web/app/components/KanbanBoard.tsx`
2. **İşlev**: Carwash job'larını Kanban board formatında göster
3. **Sütunlar**: Her JobStatus değeri için bir sütun (6 sütun)
4. **Özellikler**:
   - Job kartlarını sürükle-bırak ile sütunlar arasında taşıma
   - Her kartta: araba bilgileri (licensePlate, carBrand), müşteri, servis tipi, tarih
   - Status güncelleme: kart sürüklendiğinde otomatik PATCH isteği
   - Real-time güncelleme: polling veya WebSocket (basit polling yeterli)
5. **Stil**: Tailwind CSS ile modern, responsive design

### Teknik Detaylar
- **State management**: React state + API calls
- **Drag & Drop**: `@dnd-kit` veya `react-beautiful-dnd` kullan
- **API integration**: 
  - GET `/api/jobs` ile job'ları fetch et
  - PATCH `/api/jobs/[id]` ile status güncelle
- **Error handling**: API hatalarını kullanıcıya gösterme
- **Loading states**: Fetch sırasında loading göstergesi

### Komponent Yapısı
```tsx
interface KanbanBoardProps {
  // Props gerekirse
}

interface JobCardProps {
  job: JobType;
}

interface ColumnProps {
  status: JobStatus;
  jobs: JobType[];
}
```

### Beklenen Çıktı
1. **Tam KanbanBoard.tsx dosyası** (TypeScript + React)
2. **Gerekli import'lar** (React, dnd library, API utilities)
3. **Type definitions** (JobType, JobStatus, vs.)
4. **Tailwind CSS classes** ile responsive design
5. **API integration** ve error handling
6. **Drag & Drop implementasyonu**

### Önemli Notlar
- **Basit başla**: İlk versiyonda sadece temel drag & drop çalışsın
- **Backend uyumu**: PATCH endpoint hazır olunca test et
- **Kullanıcı deneyimi**: Status değişikliğini kullanıcıya bildir (toast veya inline)
- **Performans**: Büyük liste için virtualization düşün (sonraki adım)

### Başlangıç İpuçları
1. Önce statik Kanban board oluştur (sütunlar + dummy data)
2. Sonra API integration ekle
3. En son drag & drop özelliğini ekle
4. Test et ve hataları düzelt

**Hemen başla - KanbanBoard.tsx component'ini oluştur. Önce statik versiyon, sonra API integration, en son drag & drop.**