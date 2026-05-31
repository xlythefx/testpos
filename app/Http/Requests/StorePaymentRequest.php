<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id', 'unique:payments,order_id'],
            'method' => ['required', 'in:cash,card,digital_wallet'],
            'amount_tendered' => ['required', 'numeric', 'min:0'],
            'change_due' => ['sometimes', 'numeric', 'min:0'],
            'paid_at' => ['sometimes', 'date'],
        ];
    }
}
