<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BroadcastRequest extends Model
{
    protected $fillable = [
        'citizen_id', 'medicine_id', 'notes', 'status',
        'responding_pharmacy_id', 'pharmacy_notes',
    ];

    // status: open | responded | accepted | closed
    public function citizen()
    {
        return $this->belongsTo(User::class, 'citizen_id');
    }

    public function medicine()
    {
        return $this->belongsTo(medicines::class);
    }

    public function respondingPharmacy()
    {
        return $this->belongsTo(Pharmacy::class, 'responding_pharmacy_id');
    }
}
