<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'phone',
        'address',
        'profile_image',
        'role',
        'status',
        'license_number',
        'license_expiry',
        'area',
        'latitude',
        'longitude',
        'working_hours',
        'delivery_available',
        'delivery_fee',
        'rating',
        'review_count',
        'is_active',
        'permissions',
    ];

    protected $casts = [
        'working_hours' => 'array',
        'permissions' => 'array',
        'delivery_available' => 'boolean',
        'is_active' => 'boolean',
        'license_expiry' => 'date',
        'rating' => 'decimal:2',
    ];

    // Citizen orders
    public function orders()
    {
        return $this->hasMany(orders::class, 'citizen_id');
    }

    // Pharmacy orders
    public function pharmacyOrders()
    {
        return $this->hasMany(orders::class, 'pharmacy_id');
    }

    /** ملف الصيدلية المرتبط بحساب المستخدم (إن كان role = pharmacy) */
    public function pharmacyProfile()
    {
        return $this->hasOne(Pharmacy::class);
    }
}