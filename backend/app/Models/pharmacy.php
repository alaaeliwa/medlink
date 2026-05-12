<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'medicine_id',
        'quantity',
        'price',
        'cost_price',
        'minimum_stock',
        'maximum_stock',
        'last_restock_date',
        'expiry_date',
        'status',
    ];

    protected $casts = [
        'last_restock_date' => 'datetime',
        'expiry_date' => 'date',
    ];

    public function pharmacy()
    {
        return $this->belongsTo(User::class, 'pharmacy_id');
    }

    public function medicine()
    {
        return $this->belongsTo(medicines::class);
    }
}