<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;


class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'role', 'avatar', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // roles: admin | citizen | pharmacy
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return ['role' => $this->role];
    }

    public function pharmacy()
    {
        return $this->hasOne(Pharmacy::class);
    }

    public function orders()
    {
        return $this->hasMany(order::class, 'citizen_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'citizen_id');
    }

    public function broadcastRequests()
    {
        return $this->hasMany(BroadcastRequest::class, 'citizen_id');
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'citizen_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'citizen_id');
    }
}
