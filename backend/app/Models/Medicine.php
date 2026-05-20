<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * نموذج الدواء (Medicine) — يطابق جدول `medicines` في قاعدة البيانات.
 * كل دواء ينتمي لفئة واحدة (category) ويمكن أن يظهر في مخزون عدة صيدليات عبر inventory_items.
 */
class Medicine extends Model
{
    use HasFactory;

    /** اسم الجدول في MySQL (جمع) */
    protected $table = 'medicines';

    protected $fillable = [
        'category_id',
        'name',
        'generic_name',
        'strength',
        'price',
        'form',
        'manufacturer',
        'stock',
        'description',
        'requires_prescription',
        'is_controlled',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'requires_prescription' => 'boolean',
        'is_controlled' => 'boolean',
        'is_active' => 'boolean',
        'expiry_date' => 'date',
    ];

    /** FK: category_id → categories.id */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** مخزون هذا الدواء لدى الصيدليات */
    public function inventoryItems(): HasMany
    {
        return $this->hasMany(InventoryItem::class, 'medicine_id');
    }
}
