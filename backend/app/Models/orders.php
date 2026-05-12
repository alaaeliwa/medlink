<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'citizen_id',
        'pharmacy_id',
        'medicines',
        'total_price',
        'urgency',
        'notes',
        'status',
        'status_timeline',
        'pharmacy_response',
        'response_date',
        'order_date',
        'expected_delivery',
        'completed_at',
    ];

    protected $casts = [
        'medicines' => 'array',
        'status_timeline' => 'array',
        'total_price' => 'decimal:2',
        'order_date' => 'datetime',
        'response_date' => 'datetime',
        'expected_delivery' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function pharmacy()
    {
        return $this->belongsTo(User::class, 'pharmacy_id');
    }
}