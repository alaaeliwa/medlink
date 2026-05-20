<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * عنصر مخزون — يربط صيدلية بدواء مع كمية وسعر (جدول inventory_items).
 * UNIQUE (pharmacy_id, medicine_id) يمنع تكرار نفس الدواء لنفس الصيدلية.
 */
class InventoryItem extends Model
{
    use HasFactory;

    protected $table = 'inventory_items';

    protected $fillable = [
        'pharmacy_id',
        'medicine_id',
        'quantity',
        'price',
        'cost_price',
        'minimum_stock',
        'maximum_stock',
        'status',
        'expiry_date',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'expiry_date' => 'date',
    ];

    /** FK → pharmacies.id (وليس users.id) */
    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }
}
