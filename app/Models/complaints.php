<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaints extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'reporter_id',
        'against_pharmacy_id',
        'subject',
        'details',
        'severity',
        'status',
        'assigned_admin_id',
        'resolution',
        'resolution_date',
    ];

    protected $casts = [
        'resolution_date' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function pharmacy()
    {
        return $this->belongsTo(User::class, 'against_pharmacy_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'assigned_admin_id');
    }
}