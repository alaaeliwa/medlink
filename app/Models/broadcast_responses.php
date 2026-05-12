<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class broadcast_responses extends Model
{
    use HasFactory;

    protected $table = 'broadcast_responses';

    // =============================================================
    // الإعدادات الجوهرية للـ UUID (لحل مشكلة الرقم 0 والربط)
    // =============================================================
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',           // أضفناه لأننا ننشئ المعرف يدوياً في السييدر
        'request_id',    // تم التغيير من broadcast_request_id ليطابق السييدر
        'pharmacy_id',          
        'price',               
        'notes',               
        'status',       // أضفناه ليطابق المايجريشن والسييدر
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // =============================================================
    // العلاقات (Relationships)
    // =============================================================

    /**
     * العلاقة مع طلب البث الأصلي
     */
    public function request()
    { 
        // تأكدي من استخدام request_id كمفتاح أجنبي هنا أيضاً
        return $this->belongsTo(broadcast_requests::class, 'request_id');
    }

    /**
     * العلاقة مع الصيدلية التي قدمت الرد
     */
    public function pharmacy()
    {
        return $this->belongsTo(pharmacies::class, 'pharmacy_id');
    }
}