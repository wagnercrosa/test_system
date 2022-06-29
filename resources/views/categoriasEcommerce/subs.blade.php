@extends('default.layout')
@section('content')
<div class="card card-custom gutter-b">
	<div class="card-body">
		<div class="@if(getenv('ANIMACAO')) animate__animated @endif animate__backInLeft">
			<div class="col-sm-12 col-lg-4 col-md-6 col-xl-4">

				<a href="/categoriaEcommerce/newSub/{{$categoria->id}}" class="btn btn-lg btn-success">
					<i class="fa fa-plus"></i>Nova SubCategoria
				</a>
			</div>
		</div>
		<br>
		<div class="" id="kt_user_profile_aside" style="margin-left: 10px; margin-right: 10px;">
			<br>
			<h4 class="@if(getenv('ANIMACAO')) animate__animated @endif animate__backInRight">SubCategorias: <strong class="text-danger">{{$categoria->nome}}</strong></h4>
			<div class="row @if(getenv('ANIMACAO')) animate__animated @endif animate__backInRight">

				@foreach($categoria->subs as $c)

				<div class="col-sm-12 col-lg-6 col-md-6 col-xl-4">
					<div class="card card-custom gutter-b example example-compact">
						<div class="card-header">

							<h3 class="card-title">{{$c->nome}}
							</h3>
							<div class="card-toolbar">

								<a href="/categoriaEcommerce/editSubs/{{$c->id}}" class="btn btn-icon btn-circle btn-sm btn-light-primary mr-1"><i class="la la-pencil"></i></a>
								<a href="/categoriaEcommerce/deleteSub/{{$c->id}}" class="btn btn-icon btn-circle btn-sm btn-light-danger mr-1"><i class="la la-trash"></i></a>

							</div>
						</div>

					</div>

				</div>

				@endforeach

			</div>
		</div>
	</div>
</div>

@endsection