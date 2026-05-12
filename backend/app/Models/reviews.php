<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class reviews extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'pharmacy_id',
        'rating',
        'review_text',
    ];

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function pharmacy()
    {
        return $this->belongsTo(User::class, 'pharmacy_id');
    }
}