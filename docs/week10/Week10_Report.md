# الأسبوع 10 — تنفيذ السيرفر (Laravel) | MedLink

**المطلوب:** بناء منطق الأعمال (Business Logic) + CRUD + نظافة الكود (تقسيم الملفات).  
**المبرمجة:** Backend — هذا المستند للمناقشة والتسليم.

---

## 1. هل قاعدة البيانات (الأسبوع 9) صحيحة؟

### نعم — بشكل عام تحقق المتطلبات

| معيار الأسبوع 9 | الحالة | أين؟ |
|-----------------|--------|------|
| ERD → SQL | ✅ | `docs/week9/MedLink_week9_schema_and_data.sql` + `backend/database/migrations/` |
| تطبيع (Normalization) | ✅ مع ملاحظات | فئات منفصلة، مخزون في `inventory_items`، سطور الطلب في `order_items` |
| PK / FK | ✅ | مفاتيح أجنبية بين users, pharmacies, medicines, orders… |
| بيانات تجريبية + تقرير | ✅ | نفس المجلد `docs/week9/Week9_Report.md` |

### ملاحظات هندسية (مهمة للمناقشة)

1. **`orders.pharmacy_id` → `users.id`** وليس `pharmacies.id` — مقصود في الـ migration الحالي (حساب الصيدلية = user).
2. **`orders.medicines` (JSON)** يكرر معلومات يمكن وضعها فقط في `order_items` — تكرار مقصود أو legacy؛ للتطبيع الكامل يُفضّل الاعتماد على `order_items`.
3. **نماذج Laravel القديمة** كانت غير متسقة (ملف `pharmacy.php` يحتوي `InventoryItem`، و`inventory` يشير لـ `users` بدل `pharmacies`) — **تم إصلاحها في الأسبوع 10** (انظر `app/Models/Medicine.php`, `Pharmacy.php`, `InventoryItem.php`).

---

## 2. ماذا نفّذنا في الأسبوع 10؟

### هيكل «الدماغ» — ليس ملفاً واحداً طويلاً

```
routes/api.php          ← تعريف المسارات فقط
    ↓
Http/Controllers/Api/   ← استقبال HTTP + إرجاع JSON (رقيق)
    ↓
Services/               ← منطق الأعمال + استعلامات Eloquent
    ↓
Models/                 ← تمثيل الجداول + العلاقات
    ↓
database/               ← الجداول (migrations من الأسبوع 9)
```

| الطبقة | الملفات | الدور |
|--------|---------|--------|
| **Routes** | `routes/api.php` | ربط URL بالـ Controller |
| **Controller** | `CategoryController`, `MedicineController`, … | لا يوجد SQL هنا — يستدعي Service |
| **Form Request** | `StoreMedicineRequest`, … | التحقق من المدخلات (Validation) |
| **Service** | `MedicineService`, … | Create / Read / Update / Delete + بحث |
| **Resource** | `MedicineResource`, … | شكل JSON الموحّد للرد |

هذا يحقق **Code cleanliness**: الكود مقسّم حسب المسؤولية وليس كل شيء في `web.php` أو controller واحد ضخم.

---

## 3. CRUD — جدول المسارات

القاعدة: `http://127.0.0.1:8000/api/v1/...`  
رأس الطلب للـ JSON: `Accept: application/json` و `Content-Type: application/json`

### الفئات `categories`

| العملية | Method | المسار |
|---------|--------|--------|
| عرض الكل | GET | `/api/v1/categories` |
| عرض واحد | GET | `/api/v1/categories/{id}` |
| إضافة | POST | `/api/v1/categories` |
| تعديل | PUT/PATCH | `/api/v1/categories/{id}` |
| حذف | DELETE | `/api/v1/categories/{id}` |

### الأدوية `medicines` (+ بحث)

| العملية | Method | المسار |
|---------|--------|--------|
| عرض + بحث | GET | `/api/v1/medicines?q=panadol&category_id=1` |
| باقي CRUD | | نفس نمط `categories` |

البحث في `MedicineService::paginate()` — يطابق الاسم أو الاسم العلمي (`generic_name`).

### الصيدليات `pharmacies`

فلترة: `?area=Downtown&status=verified`

### مخزون الصيدلية `inventory-items`

فلترة: `?pharmacy_id=1`  
عند الإنشاء/التحديث: `InventoryItemService` يحسب `status` تلقائياً (`in_stock` / `low_stock` / `out_of_stock`).

---

## 4. أمثلة Postman / curl

```bash
# تشغيل السيرفر (من مجلد backend)
php artisan migrate
php artisan db:seed
php artisan serve

# عرض الأدوية
curl -s "http://127.0.0.1:8000/api/v1/medicines"

# بحث
curl -s "http://127.0.0.1:8000/api/v1/medicines?q=panadol"

# إضافة فئة
curl -s -X POST "http://127.0.0.1:8000/api/v1/categories" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Vitamins\",\"description\":\"مكملات\"}"
```

شكل الرد الناجح:

```json
{
  "success": true,
  "message": "تمت العملية بنجاح",
  "data": { ... }
}
```

---

## 5. شرح سريع لمسار طلب واحد (مثال: إضافة دواء)

1. المتصفح/Postman يرسل `POST /api/v1/medicines` + JSON.
2. Laravel يوجّه إلى `MedicineController@store`.
3. `StoreMedicineRequest` يتحقق من الحقول (`category_id` موجود، `price` رقم…).
4. `MedicineService::create()` ينشئ السجل في جدول `medicines`.
5. `MedicineResource` يحوّل النموذج إلى JSON ويرجع `201 Created`.

---

## 6. ما تبقى لاحقاً (خارج نطاق الأسبوع 10 الأساسي)

- مصادقة (Laravel Sanctum) لحماية المسارات حسب الدور (citizen / pharmacy / admin).
- CRUD لـ `orders`, `broadcast_requests`, `complaints` بنفس النمط.
- ربط الفرونت: استبدال `ALL_MEDICINES` في `data-engine.js` بـ `fetch('/api/v1/medicines?q=...')`.

---

## 7. ملفات التسليم الأسبوع 10

| الملف / المجلد |
|----------------|
| `backend/routes/api.php` |
| `backend/app/Services/*` |
| `backend/app/Http/Controllers/Api/*` |
| `backend/app/Http/Requests/*` |
| `backend/app/Http/Resources/*` |
| `docs/week10/Week10_Report.md` (هذا الملف) |

**الأسبوع 9 يبقى كما هو:** `docs/week9/MedLink_week9_schema_and_data.sql` + `Week9_Report.md`.
