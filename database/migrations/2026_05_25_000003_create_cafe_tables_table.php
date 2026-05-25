<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Physical café tables — named "cafe_tables" to avoid SQL reserved word collision
        Schema::create('cafe_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedSmallInteger('capacity');
            $table->enum('status', ['available', 'occupied', 'reserved'])->default('available');
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
