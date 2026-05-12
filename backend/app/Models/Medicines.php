<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class medicines extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'generic_name',
        'category_id',
        'strength',
        'form',
        'manufacturer',
        'description',
        'side_effects',
        'precautions',
        'active_ingredients',
        'requires_prescription',
        'is_controlled',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'active_ingredients' => 'array',
        'requires_prescription' => 'boolean',
        'is_controlled' => 'boolean',
        'is_active' => 'boolean',
        'expiry_date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }
}