<?php

use App\Http\Controllers\AccountPlanController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollConceptController;
use App\Http\Controllers\ProductServiceController;
use App\Http\Controllers\RetentionController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth/login', [AuthController::class, 'login']);


// Route::middleware(['auth'])->group(function () {

    // ------------------------------ USUARIOS
    Route::get('/users', [AuthController::class, 'index']);
    Route::post('/users-create', [AuthController::class, 'store']);
    Route::get('/users-show/{id}', [AuthController::class, 'show']);
    Route::put('/users-update/{id}', [AuthController::class, 'update']);
    Route::delete('/users-destroy/{id}', [AuthController::class, 'destroy']);

    Route::put('/users-updateStep/{id}', [AuthController::class, 'updateStep']);
    Route::put('/users-updateStepEdit/{id}', [AuthController::class, 'updateStepEdit']);
    Route::put('/users-desactiveActiveUser/{id}', [AuthController::class, 'desactiveActiveUser']);


    // ------------------------------ ROLES
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles-create', [RoleController::class, 'store']);
    Route::get('/roles-show/{id}', [RoleController::class, 'show']);
    Route::put('/roles-update/{id}', [RoleController::class, 'update']);
    Route::delete('/roles-destroy/{id}', [RoleController::class, 'destroy']);

    // ------------------------------ COMPANIES
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::post('/companies-create', [CompanyController::class, 'store']);
    Route::get('/companies-show/{id}', [CompanyController::class, 'show']);
    Route::post('/companies-update/{id}', [CompanyController::class, 'update']);
    Route::put('/companyDescriptionAdmin/{id}', [CompanyController::class, 'companyDescriptionAdmin']);
    Route::delete('/companies-destroy/{id}', [CompanyController::class, 'destroy']);

    // ------------------------------ COMPANIES
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients-create', [ClientController::class, 'store']);
    Route::get('/clients-show/{id}', [ClientController::class, 'show']);
    Route::post('/clients-update/{id}', [ClientController::class, 'update']);
    Route::put('/clientsDescriptionAdmin/{id}', [ClientController::class, 'clientsDescriptionAdmin']);
    Route::delete('/clients-destroy/{id}', [ClientController::class, 'destroy']);

    // ------------------------------ SUPPLIERS
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::post('/suppliers-create', [SupplierController::class, 'store']);
    Route::get('/suppliers-show/{id}', [SupplierController::class, 'show']);
    Route::post('/suppliers-update/{id}', [SupplierController::class, 'update']);
    Route::put('/supplierDescriptionAdmin/{id}', [SupplierController::class, 'supplierDescriptionAdmin']);
    Route::delete('/suppliers-destroy/{id}', [SupplierController::class, 'destroy']);

    // ------------------------------ RETENTIONS
    Route::get('/retentions', [RetentionController::class, 'index']);
    Route::post('/retentions-create', [RetentionController::class, 'store']);
    Route::get('/retentions-show/{id}', [RetentionController::class, 'show']);
    Route::post('/retentions-update/{id}', [RetentionController::class, 'update']);
    Route::put('/retentionsDescriptionAdmin/{id}', [RetentionController::class, 'retentionsDescriptionAdmin']);
    Route::delete('/retentions-destroy/{id}', [RetentionController::class, 'destroy']);

    // ------------------------------ RETENTIONS
    Route::get('/employee', [EmployeeController::class, 'index']);
    Route::post('/employee-create', [EmployeeController::class, 'store']);
    Route::get('/employee-show/{id}', [EmployeeController::class, 'show']);
    Route::post('/employee-update/{id}', [EmployeeController::class, 'update']);
    Route::put('/employeeDescriptionAdmin/{id}', [EmployeeController::class, 'employeeDescriptionAdmin']);
    Route::delete('/employee-destroy/{id}', [EmployeeController::class, 'destroy']);

    // ------------------------------ PRODUCTOS SERVICIOS
    Route::get('/products', [ProductServiceController::class, 'index']);
    Route::post('/products-create', [ProductServiceController::class, 'store']);
    Route::get('/products-show/{id}', [ProductServiceController::class, 'show']);
    Route::post('/products-update/{id}', [ProductServiceController::class, 'update']);
    Route::put('/productServiceDescriptionAdmin/{id}', [ProductServiceController::class, 'productServiceDescriptionAdmin']);
    Route::delete('/products-destroy/{id}', [ProductServiceController::class, 'destroy']);

    // ------------------------------ ACCOUNTS PLANS
    Route::get('/account_plans', [AccountPlanController::class, 'index']);
    Route::post('/account_plans-create', [AccountPlanController::class, 'store']);
    Route::get('/account_plans-show/{id}', [AccountPlanController::class, 'show']);
    Route::post('/account_plans-update/{id}', [AccountPlanController::class, 'update']);
    Route::put('/accountPlanDescriptionAdmin/{id}', [AccountPlanController::class, 'accountPlanDescriptionAdmin']);
    Route::delete('/account_plans-destroy/{id}', [AccountPlanController::class, 'destroy']);

    // ------------------------------ BANKS
    Route::get('/banks', [BankController::class, 'index']);
    Route::post('/banks-create', [BankController::class, 'store']);
    Route::get('/banks-show/{id}', [BankController::class, 'show']);
    Route::post('/banks-update/{id}', [BankController::class, 'update']);
    Route::put('/bankDescriptionAdmin/{id}', [BankController::class, 'bankDescriptionAdmin']);
    Route::delete('/banks-destroy/{id}', [BankController::class, 'destroy']);

    // ------------------------------ PAYROLL CONCEPT
    Route::get('/payroll_concepts', [PayrollConceptController::class, 'index']);
    Route::post('/payroll_concepts-create', [PayrollConceptController::class, 'store']);
    Route::get('/payroll_concepts-show/{id}', [PayrollConceptController::class, 'show']);
    Route::post('/payroll_concepts-update/{id}', [PayrollConceptController::class, 'update']);
    Route::put('/payrollConceptsDescriptionAdmin/{id}', [PayrollConceptController::class, 'payrollConceptsDescriptionAdmin']);
    Route::delete('/payroll_concepts-destroy/{id}', [PayrollConceptController::class, 'destroy']);

    // ------------------------------ USER PROFILES
    Route::get('/user_profiles', [UserProfileController::class, 'index']);
    Route::post('/user_profiles-create', [UserProfileController::class, 'store']);
    Route::get('/user_profiles-show/{id}', [UserProfileController::class, 'show']);
    Route::post('/user_profiles-update/{id}', [UserProfileController::class, 'update']);
    Route::put('/userProfilesDescriptionAdmin/{id}', [UserProfileController::class, 'userProfilesDescriptionAdmin']);
    Route::delete('/user_profiles-destroy/{id}', [UserProfileController::class, 'destroy']);
// });
