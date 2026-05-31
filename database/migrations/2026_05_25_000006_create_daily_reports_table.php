<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// NOTE: This file supersedes the earlier daily_reports draft.
// Payments are a first-class spec resource; daily reports are computed on the fly.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                  ->unique()                                 // one payment per order
                  ->constrained('orders')
                  ->cascadeOnDelete();
            $table->enum('method', ['cash', 'card', 'digital_wallet']);
            $table->decimal('amount_tendered', 10, 2);
            $table->decimal('change_due', 10, 2)->default(0.00);
            $table->timestamp('paid_at')->useCurrent();
            $table->timestamps();

            $table->index('method');                         // payment-method split report
            $table->index('paid_at');                        // date-range report queries
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
