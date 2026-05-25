<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'pharmacy_name' => $this->pharmacy_name,
            'license_number' => $this->license_number,
            'license_expiry' => $this->license_expiry?->format('Y-m-d'),
            'address' => $this->address,
            'area' => $this->area,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'delivery_available' => $this->delivery_available,
            'delivery_fee' => $this->delivery_fee,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
            'status' => $this->status,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'email' => $this->user->email,
                'first_name' => $this->user->first_name,
                'last_name' => $this->user->last_name,
            ]),
            'inventory_items' => InventoryItemResource::collection($this->whenLoaded('inventoryItems')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
