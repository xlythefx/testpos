<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['sometimes', 'required', 'integer', 'exists:orders,id', Rule::unique('payments', 'order_id')->ignore($this->route('payment'))],
            'method' => ['sometimes', 'required', 'in:cash,card,digital_wallet'],
            'amount_tendered' => ['sometimes', 'required', 'numeric', 'min:0'],
            'change_due' => ['sometimes', 'numeric', 'min:0'],
            'paid_at' => ['sometimes', 'date'],
        ];
    }
}
