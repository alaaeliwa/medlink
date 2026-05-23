<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['citizen_id', 'medicine_id', 'pharmacy_id'];

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function medicine()
    {
        return $this->belongsTo(medicines::class);
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
