<?php
class Controller 
{
	protected $model;
	protected $view;
	
	function __construct()
	{
		$this->view = new View();
	}

	protected static function isAjaxRequest(): bool
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
	
	protected static function sendForbiddenResponse(): void
    {
        http_response_code(403);
        exit();
    }

	function action_index($params)
	{
	}
}
