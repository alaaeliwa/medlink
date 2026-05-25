<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePharmacyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('pharmacy');

        return [
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'pharmacy_name' => ['sometimes', 'string', 'max:255'],
            'license_number' => ['sometimes', 'string', 'max:255', Rule::unique('pharmacies', 'license_number')->ignore($id)],
            'license_expiry' => ['nullable', 'date'],
            'address' => ['sometimes', 'string'],
            'area' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'delivery_available' => ['sometimes', 'boolean'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'review_count' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::in(['pending', 'verified', 'rejected', 'suspended'])],
        ];
    }
}
