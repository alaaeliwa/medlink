<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'citizen_id', 'pharmacy_id', 'inventory_item_id',
        'quantity', 'total_price', 'status', 'notes',
    ];

    // status: pending | approved | ready | cancelled
    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
