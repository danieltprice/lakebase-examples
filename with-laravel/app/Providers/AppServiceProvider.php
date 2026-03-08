<?php

namespace App\Providers;

use App\LakebaseAuth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('DATABRICKS_HOST') && env('LAKEBASE_HOST')) {
            try {
                Config::set('database.connections.pgsql.url', LakebaseAuth::getConnectionUrl());
            } catch (\Throwable $e) {
                report($e);
            }
        }
    }
}
