<?php

namespace App\Http\Requests;

use App\Models\InventoryItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $item = InventoryItem::query()->find($this->route('inventory_item'));
        $pharmacyId = $this->input('pharmacy_id', $item?->pharmacy_id);

        return [
            'pharmacy_id' => ['sometimes', 'integer', 'exists:pharmacies,id'],
            'medicine_id' => [
                'sometimes',
                'integer',
                'exists:medicines,id',
                Rule::unique('inventory_items', 'medicine_id')
                    ->where(fn ($q) => $q->where('pharmacy_id', $pharmacyId))
                    ->ignore($this->route('inventory_item')),
            ],
            'quantity' => ['sometimes', 'integer', 'min:0'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'minimum_stock' => ['nullable', 'integer', 'min:0'],
            'maximum_stock' => ['nullable', 'integer', 'min:0'],
            'expiry_date' => ['nullable', 'date'],
        ];
    }
}
