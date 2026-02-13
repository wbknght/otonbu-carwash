## Görev: Carwash System Kanban Board Test ve Doğrulama

### Proje Bilgisi
- **Proje**: Otonbu Carwash System (Araba yıkama sistemi)
- **Teknoloji Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase
- **Dizin**: `/Users/sezeryasar/.openclaw/workspace/carwash-system/apps/web/`

### Mevcut Geliştirmeler
1. **Backend**: PATCH `/api/jobs/[id]` endpoint'i oluşturuldu
2. **Frontend**: Kanban Board component'i geliştiriliyor

### Gereksinimler
**Tüm sistemi test et ve doğrula**:

#### A. Backend PATCH Endpoint Testleri
1. **Happy Path Test**: Geçerli bir job ID ve status ile PATCH isteği gönder → 200 OK ve güncellenmiş job dönmeli
2. **Validation Testleri**:
   - Eksik status field → 400 Bad Request
   - Geçersiz status değeri → 400 Bad Request
   - Geçersiz job ID formatı → 400 Bad Request
   - Mevcut olmayan job ID → 404 Not Found
3. **Database Test**: Prisma hatalarını ele alma → 500 Internal Server Error
4. **JSON Parsing Test**: Geçersiz JSON body → 400 Bad Request

#### B. Frontend Kanban Board Testleri
1. **Component Render Test**: KanbanBoard component'i tüm sütunlarla render olmalı
2. **API Integration Test**:
   - GET `/api/jobs`'dan job'ları fetch etmeli
   - PATCH `/api/jobs/[id]` ile status güncellemeli
3. **Drag & Drop Test**: Kart sürükle-bırak çalışmalı ve backend'e PATCH isteği göndermeli
4. **UI/UX Test**:
   - Loading state görüntülenmeli
   - Error state görüntülenmeli
   - Success feedback gösterilmeli
5. **Responsive Design Test**: Farklı ekran boyutlarında çalışmalı

#### C. Entegrasyon Testleri
1. **End-to-End Flow**: Frontend'den drag & drop → Backend PATCH → Database update → Frontend refresh
2. **Data Consistency**: Frontend'deki job status'ü backend'dekilerle eşleşmeli
3. **Real-time Updates**: Polling veya manual refresh ile güncel veri gösterilmeli

### Test Araçları ve Yaklaşım
- **Manual Testing**: Postman/curl ile API testleri
- **Component Testing**: React component'inin render testi
- **Integration Testing**: API + frontend birlikte test
- **End-to-End Testing**: Tam kullanıcı akışı testi

### Beklenen Çıktılar
1. **Test Raporu**: Tüm test senaryolarının sonuçları
2. **Hata Raporları**: Bulunan bug'lar ve önerilen fix'ler
3. **Doğrulama Onayı**: Sistemin Kanban board gereksinimlerini karşıladığı onayı
4. **Öneriler**: İyileştirme ve optimizasyon önerileri

### Kritik Test Senaryoları
1. **Kanban Board Temel İşlev**:
   - Job'lar doğru status sütunlarında görünmeli
   - Drag & drop ile status değiştirilebilmeli
   - Status değişikliği backend'e yansıtılmalı
   - UI status değişikliğini real-time göstermeli

2. **Hata Senaryoları**:
   - API offline iken uygun hata mesajı
   - Network error durumunda retry mekanizması
   - Invalid data durumunda kullanıcıya bilgi

3. **Performans Testleri**:
   - 50+ job ile performans sorunu olmamalı
   - Drag & drop smooth çalışmalı
   - API calls optimize edilmeli

### Test Adımları
1. **Backend API Testleri** (Postman/curl ile)
2. **Frontend Component Testleri** (Browser'da manual)
3. **Entegrasyon Testleri** (Tam akış)
4. **Kullanıcı Kabul Testleri** (UI/UX değerlendirmesi)

### Doğrulama Kriterleri
- [ ] PATCH endpoint tüm test senaryolarını geçiyor
- [ ] Kanban board tüm job'ları doğru sütunlarda gösteriyor
- [ ] Drag & drop çalışıyor ve backend'i güncelliyor
- [ ] UI responsive ve kullanıcı dostu
- [ ] Error handling doğru çalışıyor
- [ ] Real-time updates çalışıyor
- [ ] Sistem production-ready görünüyor

**Test sürecini başlat ve kapsamlı bir test raporu hazırla.**