<?php
define('APP_PATH', 'application/');
define('CONTROLLERS_PATH', APP_PATH . 'controllers/');
define('MODELS_PATH', APP_PATH . 'models/');

class Route
{
	static public function start()
	{
		$controller_name = 'Choose_Cort';
		$action_name = 'index';
		$params = $_GET;

        $url_parts = parse_url($_SERVER['REQUEST_URI']);
        $path = trim($url_parts['path'], '/');
		
		$routes = explode('/', $path);

		if ( !empty($routes[1]) )
		{	
			$controller_name = $routes[1];
		}
		
		if ( !empty($routes[2]) )
		{
			$action_name = $routes[2];
		}

		$model_name = 'Model_'.$controller_name;
		$controller_name = 'Controller_'.$controller_name;
		$action_name = 'action_'.$action_name;

		$model_file = strtolower($model_name) . '.php';
        $model_path = MODELS_PATH . $model_file;

        if (file_exists($model_path)) {
            include $model_path;
        }

		$controller_file = strtolower($controller_name) . '.php';
        $controller_path = CONTROLLERS_PATH . $controller_file;

        if (file_exists($controller_path)) {
            include $controller_path;
        } else {
            self::ErrorPage404();
        }
		
		$controller = new $controller_name;
		$action = $action_name;
		
		if(method_exists($controller, $action))
		{
			$controller->$action($params);
		}
		else
		{
			self::ErrorPage404();
		}
	}
	
	static public function ErrorPage404()
	{
    	http_response_code(404);
    	exit();
	}

}