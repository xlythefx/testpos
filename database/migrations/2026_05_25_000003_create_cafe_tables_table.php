<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Physical café tables — named "cafe_tables" to avoid MySQL reserved-word collision
        Schema::create('cafe_tables', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('number')->unique();  // human-readable table number (1, 2, 3…)
            $table->unsignedSmallInteger('capacity')->default(4);
            $table->enum('status', ['available', 'occupied', 'reserved'])->default('available');
            // status is primarily derived from active orders; stored for manual override (e.g. reserved)
            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cafe_tables');
    }
};
