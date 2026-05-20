<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'name' => $this->name,
            'generic_name' => $this->generic_name,
            'strength' => $this->strength,
            'price' => $this->price,
            'form' => $this->form,
            'manufacturer' => $this->manufacturer,
            'stock' => $this->stock,
            'description' => $this->description,
            'requires_prescription' => $this->requires_prescription,
            'is_controlled' => $this->is_controlled,
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
