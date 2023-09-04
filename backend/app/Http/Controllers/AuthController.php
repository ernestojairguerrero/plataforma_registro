<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function index()
    {
        $users = User::with('role')->orderBy('id')->get();

        return response()->json([
            [
                'success' => true,
                'data' => $users ?? []
            ]
        ], 200);
    }


    public function show($id)
    {
        $user = User::with('company', 'client', 'supplier', 'retention', 'employee', 'bank', 'payrollConcept', 'accountPlan', 'productService', 'userPerfile')->find($id);

        if ($user) {
            return response()->json([

                'success' => true,
                'data' => [$user] ?? []

            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }
    }



    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
            'role_id' => 'required|int',
        ]);

        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                [
                    'success' => false,
                    'messege' => 'El correo electrónico ya está en uso'
                ]
            ], 400);
        }

        User::create([
            'name' => $request->name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $request->role_id
        ]);

        return response()->json([
            [
                'success' => true,
                'message' => 'Usuario creado correctamente'
            ]
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'string',
            'last_name' => 'string',
            'email' => 'email|unique:users,email,' . $id,
            'role_id' => 'int',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json([
                [
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ]
            ], 404);
        }

        $updateData = [];
        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }
        if ($request->has('last_name')) {
            $updateData['last_name'] = $request->last_name;
        }
        if ($request->has('email')) {
            $updateData['email'] = $request->email;
        }
        if ($request->has('role_id')) {
            $updateData['role_id'] = $request->role_id;
        }
        if (User::where('email', $request->email)->where('id', '!=', $id)->exists()) {
            return response()->json([
                [
                    'success' => false,
                    'message' => 'El email ya existe'
                ]
            ], 400);
        }
        $user->update($updateData);

        return response()->json([
            [
                'success' => true,
                'message' => 'Usuario actualizado exitosamente'
            ]
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $user->company()->delete();
        $user->client()->delete();
        $user->bank()->delete();
        $user->employee()->delete();
        $user->payrollConcept()->delete();
        $user->retention()->delete();
        $user->supplier()->delete();
        $user->userPerfile()->delete();
        $user->accountPlan()->delete();
        $user->productService()->delete();

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario y compañías relacionadas eliminados correctamente'
        ], 200);
    }


    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::with('role')->where('email', $request->email)->where('active', true)->first();
        if (!$user || !Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas o usuario inactivo'
            ], 401);
        }
        return response()->json([
            'success' => true,
            'message' => 'Usuario logeado correctamente',
            'data' => [$user],
            'token' => $user->createToken('API Token')->plainTextToken
        ], 200);
    }


    public function updateStep(Request $request, $id)
    {

        $request->validate([
            'step' => 'required'
        ]);

        $user = User::find($id);

        if ($user) {
            $user->step = $request->step;
            $user->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }

    public function updateStepEdit(Request $request, $id)
    {

        $request->validate([
            'step_edit' => 'required'
        ]);

        $user = User::find($id);

        if ($user) {
            $user->step_edit = $request->step_edit;
            $user->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }

    public function desactiveActiveUser(Request $request, $id){
        $request->validate([
            'active' => 'required'
        ]);

        $user = User::find($id);

        if ($user) {
            $user->active = $request->active;
            $user->save();
            return response()->json([
                'success' => true,
                'message' => 'Acutalizado correctamente'
            ], 200);
        } else {
            return response()->json(['message' => 'No encontrado'], 404);
        }
    }
}
