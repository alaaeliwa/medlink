<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class UserController extends Controller
{
    public function me()
    {
        /** @var User $user */
        $user = auth('api')->user();
        
        $user->load('pharmacy'); 
        
        return $this->success('User profile.', $user);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:100',
            'last_name'  => 'sometimes|string|max:100',
            'phone'      => 'sometimes|string|max:20',
            'email'      => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', $validator->errors(), 422);
        }

        $user->update($request->only('first_name', 'last_name', 'phone', 'email'));

        return $this->success('Profile updated.', $user);
    }

    public function changePassword(Request $request)
    {
        /** @var User $user */
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', $validator->errors(), 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->error('Current password is incorrect.', [], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return $this->success('Password changed successfully.');
    }

    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed.', $validator->errors(), 422);
        }

        /** @var User $user */
        $user = auth('api')->user();
        
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return $this->success('Avatar uploaded.', ['avatar' => $path]);
    }
}
