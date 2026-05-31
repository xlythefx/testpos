<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function index()
    {
        return PaymentResource::collection(
            Payment::with('order')->latest()->paginate(15)
        );
    }

    public function store(StorePaymentRequest $request)
    {
        $data = $request->validated();
        if (empty($data['paid_at'])) {
            $data['paid_at'] = now();
        }
        $payment = Payment::create($data);
        return new PaymentResource($payment->load('order'));
    }

    public function show(Payment $payment)
    {
        return new PaymentResource($payment->load('order'));
    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());
        return new PaymentResource($payment->load('order'));
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->noContent();
    }
}
