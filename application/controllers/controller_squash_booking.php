<?php

class Controller_Squash_Booking extends Controller
{
    public $model;
    public $view;

	function __construct()
	{
		$this->model = new Model_Squash_Booking();
		$this->view = new View();
	}

	function action_index($params): void
	{
		$this->view->generate('squash_booking_view.php');
	}
}
