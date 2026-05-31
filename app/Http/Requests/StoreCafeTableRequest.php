<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCafeTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number' => ['required', 'integer', 'min:1', 'unique:cafe_tables,number'],
            'capacity' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:available,occupied,reserved'],
        ];
    }
}
