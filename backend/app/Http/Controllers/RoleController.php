<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $roles
        ], 200);
    }

    public function show($id)
    {
        $role = Role::find($id);
        if ($role) {
            return response()->json([
                'success' => true,
                'data' => $role
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Rol no encontrado'
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        if (Role::where('name', $request->name)->exists()) {
            return response()->json([
                [
                    'success' => false,
                    'messege' => 'El rol ya existe'
                ]
            ], 400);
        }

        Role::create([
            'name' => $request->name,
            'isAdmin' => $request->isAdmin
        ]);

        return response()->json([
            [
                'success' => true,
                'message' => 'Rol creado exitosamente'
            ]
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        if (Role::where('name', $request->name)->exists()) {
            return response()->json([
                'success' => false,
                'messege' => 'El rol ya existe'
            ], 400);
        } else {
            $role = Role::find($id);

            if ($role) {

                $role->update($request->only('name'));

                return response()->json([
                    'success' => true,
                    'message' => 'Rol actualizado exitosamente'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Rol no encontrado'
                ], 404);
            }
        }
    }

    public function destroy($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Rol no encontrado'
            ], 404);
        }
        if ($role->user()->count() === 0) {
            $role->delete();
            return response()->json([
                'success' => true,
                'message' => 'Rol eliminado exitosamente'
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el rol ya que tiene usuarios relacionados'
            ], 400);
        }
    }


}
