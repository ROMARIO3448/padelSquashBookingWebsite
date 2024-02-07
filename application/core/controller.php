<?php
class Controller {
	
	public $model;
	public $view;
	
	function __construct()
	{
		$this->view = new View();
	}

	protected static function isAjaxRequest()
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
	
	protected static function sendForbiddenResponse()
    {
        http_response_code(403);
        exit();
    }

	function action_index($params)
	{
	}
}