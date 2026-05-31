<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCafeTableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number' => ['sometimes', 'required', 'integer', 'min:1', Rule::unique('cafe_tables', 'number')->ignore($this->route('cafe_table'))],
            'capacity' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:available,occupied,reserved'],
        ];
    }
}
