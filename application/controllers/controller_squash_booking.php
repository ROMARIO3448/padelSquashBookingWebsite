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

	private function sendJsonResponse($dataForResponse): void
    {
        header("Content-Type: application/json");
        echo json_encode($dataForResponse);
        exit();
    }
	
	private function sendBadRequestJsonResponse($missingParams = [], $invalidParams = []): void
	{
		header("Content-Type: application/json");
    	http_response_code(400);
		if (!empty($missingParams)) 
		{
    		$errorMessage = "Error: " . implode(", ", $missingParams);
    		$errorMessage .= count($missingParams) === 1 ? " parameter is missing" : " parameters are missing";
    		echo $errorMessage;
		}
		else if(!empty($invalidParams))
		{
			$errorMessage = "Error: " . implode(", ", $invalidParams);
    		$errorMessage .= count($invalidParams) === 1 ? " parameter is invalid" : " parameters are invalid";
    		echo $errorMessage;
		}
    	exit();
	}

	private function getGETDataFromClientForJsonResponse($expectedParams): array
	{
		$missingParams = [];
		foreach ($expectedParams as $value) {
			if(isset($_GET[$value])) 
			{
    			$dataFromClient[$value] = $_GET[$value];
			}
			else
			{
				$missingParams[] = $value;
			}
		}
		if (!empty($missingParams)) 
		{
    		$this->sendBadRequestJsonResponse($missingParams);
		}
		return $dataFromClient;
	}

	private function isRequestedDateNotPastAndDateFormatValid($dateFormat, $requestedDate): bool
	{
		$currentDateObject = DateTime::createFromFormat($dateFormat, (new DateTime())->format($dateFormat));
		$requestedDateObject = DateTime::createFromFormat($dateFormat, $requestedDate);
		if ($requestedDateObject !== false) {
			if ($requestedDateObject >= $currentDateObject) {
				return $requestedDateObject->format($dateFormat) === $requestedDate;
			}
		}
		return false;
	}

	private function isDeviceStringValid($deviceString): bool
	{
		return ($deviceString === "mobile" || $deviceString === "desktop") ? true : false;
	}

	private function validateDataFromClientForInitTimetable($dataFromClient): void
	{
		$invalidParams = [];
		if(!$this->isRequestedDateNotPastAndDateFormatValid('d/m/Y', $dataFromClient['requestedDate']))
		{
			$invalidParams[] = 'requestedDate';
		}
		if(!$this->isDeviceStringValid($dataFromClient['device']))
		{
			$invalidParams[] = 'device';
		}
		if (!empty($invalidParams)) 
		{
    		$this->sendBadRequestJsonResponse([], $invalidParams);
		}
	}

	function action_init_timetable(): void
	{
		if (!Controller::isAjaxRequest()) {
            Controller::sendForbiddenResponse();
        }
		$dataFromClient = $this->getGETDataFromClientForJsonResponse(['requestedDate', 'device']);
		$this->validateDataFromClientForInitTimetable($dataFromClient);
		$dataForResponse = $this->model->getSquashTimetable($dataFromClient);
		$this->sendJsonResponse($dataForResponse);
	}

	function action_index($params): void
	{
		$this->view->generate('squash_booking_view.php');
	}
}
