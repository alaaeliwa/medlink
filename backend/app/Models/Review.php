<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['citizen_id', 'pharmacy_id', 'rating', 'comment'];

    protected $casts = ['rating' => 'integer'];

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
