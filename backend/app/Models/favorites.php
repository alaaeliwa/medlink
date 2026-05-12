<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class favorites extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'favorite_type',
        'favorite_id',
        'favorite_data',
    ];

    protected $casts = [
        'favorite_data' => 'array',
    ];

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }
}