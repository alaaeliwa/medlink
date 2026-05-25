<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/** التحقق من المدخلات عند إنشاء فئة — يفصل التحقق عن الـ Controller */
class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ];
    }
}
