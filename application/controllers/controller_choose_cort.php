<?php

class Controller_Choose_Cort extends Controller
{
    public $model;
    public $view;

	function __construct()
	{
		$this->model = new Model_Choose_Cort();
		$this->view = new View();
	}

	function action_index($params): void
	{
		$this->view->generate('choose_cort_view.php');
	}
}
