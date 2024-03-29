<?php

class Controller_Choose_Cort extends Controller
{
	function __construct()
	{
		parent::__construct();
		$this->model = new Model_Choose_Cort();
	}

	function action_index($params): void
	{
		$this->view->generate('choose_cort_view.php');
	}
}
