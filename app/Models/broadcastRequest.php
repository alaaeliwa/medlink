<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class broadcastRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'citizen_id',
        'medicine_name',
        'quantity',
        'notes',
        'urgency',
        'status',
        'responses',
        'accepted_pharmacy_id',
        'expires_at',
        'closed_at',
    ];

    protected $casts = [
        'responses' => 'array',
        'expires_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function acceptedPharmacy()
    {
        return $this->belongsTo(User::class, 'accepted_pharmacy_id');
    }
}