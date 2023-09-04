<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('nit')->unique();
            $table->string('slog'); // LOGO EMPRESA | IMAGE
            $table->string('user');
            $table->string('password');
            $table->string('email')->uniqid();
            $table->string('signature'); // FIRMA | IMGAGE
            $table->string('company_category');
            $table->string('description_user')->nullable();
            $table->string('description_admin')->nullable();
            $table->bigInteger('user_id')->default('0');
            $table->bigInteger('active')->default('1');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
}
