<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employee = Employee::all();
        $employeeData = $employee->map(function ($employee) {
            return [
                'id' => $employee->id,
                'file' => asset($employee->file),
                'description_user' => $employee->description_user,
                'description_admin' => $employee->description_admin,
                'user_id' => $employee->user_id,

            ];
        });

        return response()->json([
            'success' => true,
            'data' => $employeeData,
        ], 200);
    }

    public function show($user_id)
    {
        $employee = Employee::where('user_id', $user_id)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }

        $employeeData = [
            'id' => $employee->id,
            'file' => asset($employee->file),
            'description_user' => $employee->description_user,
            'description_admin' => $employee->description_admin,
            'user_id' => $employee->user_id,
        ];

        return response()->json([
            'success' => true,
            'data' => $employeeData
        ], 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xlsm,xlsb,xltx',
            'user_id' => 'required',
        ]);

        $file = $request->file('file')->store('public/excel/step_1');

        if ($request) {
            Employee::create([
                'file' => $file,
                'description_user' => $request->description_user,
                'user_id' => $request->user_id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Employeee creada correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    }

    public function update(Request $request, $id)
    {

        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('public/excel/step_1');
            $employee->file = $filePath;
        }

        $employee->description_user = $request->description_user;
        $employee->save();

        return response()->json([
            'success' => true,
            'message' => 'Actualizado correctamente'
        ], 200);
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);
        if ($employee) {
            $employee->delete();
            return response()->json([
                'success' => true,
                'message' => 'Eliminado correctamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No encontrado'
            ], 404);
        }
    }

    public function employeeDescriptionAdmin(Request $request, $id)
    {

        $employee = Employee::find($id);

        if ($employee) {
            $employee->description_admin = $request->description_admin;
            $employee->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
