<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ConfigNota;
use App\Models\Usuario;
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type,      Accept");
// header("Content-Type: application/json");
class AuthPdv
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $token = $request->header('token');
        $spl = explode(";", base64_decode($token));
        if(!isset($spl[1])) return response()->json($token, 401);

        $user = Usuario::
        where('id', $spl[0])
        ->where('login', $spl[1])
        ->first();

        if($user != null){
            $request->merge([ 'empresa_id' => $user->empresa_id]);

            return $next($request);
        }else{
            return response()->json($token, 401);
        }
    }
}
