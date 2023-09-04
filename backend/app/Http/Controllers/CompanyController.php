<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{

    public function index()
    {
        $companies = Company::all();
        $companiesData = $companies->map(function ($company) {
            return [
                'id' => $company->id,
                'business_name' => $company->business_name,
                'nit' => $company->nit,
                'slog' => asset($company->slog),
                'user' => $company->user,
                'password' => $company->password,
                'email' => $company->email,
                'signature' => asset($company->signature),
                'company_category' => $company->company_category,
                'user_id' => $company->user_id,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $companiesData,
        ], 200);
    }

    public function show($user_id)
    {
        $company = Company::where('user_id', $user_id)->first();

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $companyData = [
            'id' => $company->id,
            'business_name' => $company->business_name,
            'nit' => $company->nit,
            'slog' => asset($company->slog),
            'email' => $company->email,
            'user' => $company->user,
            'password' => $company->password,
            'company_category' => $company->company_category,
            'signature' => asset($company->signature),
            'description_user' => $company->description_user,
            'description_admin' => $company->description_admin,
            'user_id' => $company->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $companyData
        ], 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'business_name' => 'required|string',
            'nit' => 'required|string',
            'slog' => 'required|image|mimes:jpeg,png,jpg,gif',
            'user' => 'required|string',
            'password' => 'required|string',
            'signature' => 'required|image|mimes:jpeg,png,jpg,gif',
            'email' => 'required|string',
            'company_category' => 'required|string',
            'user_id' => 'required|string',
        ]);

        $image1 = $request->file('slog')->store('public/companies/slog');
        $image2 = $request->file('signature')->store('public/companies/signature');

        if (Company::where('business_name', $request->business_name)->where('nit', $request->nit)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'El nombre de la empresa o nit ya está en uso'
            ], 400);
        }

        Company::create([
            'business_name' => $request->business_name,
            'nit' => $request->nit,
            'slog' => $image1,
            'user' => $request->user,
            'password' => $request->password,
            'signature' => $image2,
            'email' => $request->email,
            'company_category' => $request->company_category,
            'description_user' => $request->description_user,
            'user_id' => $request->user_id

        ]);

        return response()->json([
            'success' => true,
            'message' => 'Empresa creada correctamente'
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if (Company::where('business_name', $request->business_name)->where('nit', $request->nit)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'El nombre de la empresa o nit ya está en uso'
            ], 400);
        }

        if($request->hasFile('slog') || $request->hasFile('signature')){
            $image1 = $request->file('slog')->store('public/companies/slog');
            $image2 = $request->file('signature')->store('public/companies/signature');
            $company->slog = $image1;
            $company->signature = $image2;
        }

        $company->business_name = $request->business_name;
        $company->nit = $request->nit;
        $company->user = $request->user;
        $company->password = $request->password;
        $company->email = $request->email;
        $company->company_category = $request->company_category;
        $company->description_user = $request->description_user;
        $company->save();


        return response()->json([
            'success' => true,
            'message' => 'Empresa creada correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $company = Company::find($id);
        if ($company) {
            $company->delete();
            return response()->json([
                'success' => true,
                'message' => 'Empresa eliminada correctamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Empresa no encontrada'
            ], 404);
        }
    }

    public function companyDescriptionAdmin(Request $request, $id)
    {

        $company = Company::find($id);

        if ($company) {
            $company->description_admin = $request->description_admin;
            $company->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
