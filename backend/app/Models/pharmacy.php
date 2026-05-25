<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    protected $fillable = [
        'user_id', 'name', 'license_number', 'address', 'area', 'latitude', 'longitude',
        'phone', 'description', 'logo', 'is_verified', 'is_active', 'has_delivery',
        'opening_hours', 'closing_hours',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_active'   => 'boolean',
        'has_delivery' => 'boolean',
        'latitude'    => 'float',
        'longitude'   => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function broadcastResponses()
    {
        return $this->hasMany(BroadcastRequest::class, 'responding_pharmacy_id');
    }
}
