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

	private function logSquashData($data): void 
	{
		if (is_array($data)) {
			$data = print_r($data, true);
		}
		$filePath = __DIR__ . '/squash_logs.txt';
		file_put_contents($filePath, $data . PHP_EOL, FILE_APPEND);
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

	private function getRawDataFromClient($paramName): mixed
	{
		$dataFromClient = $_GET[$paramName] ?? $_POST[$paramName] ?? null;
		if (empty($dataFromClient)) {
			$jsonArray = json_decode(file_get_contents("php://input"), true);
			if ($jsonArray !== null && isset($jsonArray[$paramName]) 
				&& json_last_error() === JSON_ERROR_NONE) {
				$dataFromClient = $jsonArray[$paramName];
			} else {
				$this->logSquashData(json_last_error_msg());
				return null;
			}
        }
		return $dataFromClient;
	}

	private function getDataFromClient($expectedParams): array
	{
		$missingParams = [];
		$dataFromClient = [];
		foreach ($expectedParams as $paramName) {
			$rawDataFromClient = $this->getRawDataFromClient($paramName);
			if(!empty($rawDataFromClient))
			{
				$dataFromClient[$paramName] = $rawDataFromClient;
			}
			else
			{
				$missingParams[] = $paramName;
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

	private function areAllDatesValid($dateFormat, $dates): bool
	{
		foreach ($dates as $date) {
			if (!$this->isRequestedDateNotPastAndDateFormatValid($dateFormat, $date)) {
				return false;
			}
		}
		return true;
	}

	private function isDeviceStringValid($deviceString): bool
	{
		return ($deviceString === "mobile" || $deviceString === "desktop") ? true : false;
	}

	private function areTimeSlotsValid($slotsToCheck): bool
	{
		$timeRegex = '/^\d{1,2}:\d{2}\s-\s\d{1,2}:\d{2}$/';
		foreach ($slotsToCheck as $times) {
			foreach ($times as $time) {
				if (!preg_match($timeRegex, $time)) {
					return false;
				}
			}
		}
		return true;
	}

	private function validateSlotsToCheck($dateFormat, $slotsToCheck, &$invalidParams): void
	{
    	if (!$this->areAllDatesValid($dateFormat, array_keys($slotsToCheck))
		||!$this->areTimeSlotsValid($slotsToCheck)) {
        	$invalidParams[] = 'slotsToCheck';
    	}
	}

	private function validateRequestedDate($dateFormat, $requestedDate, &$invalidParams): void
	{
    	if (!$this->isRequestedDateNotPastAndDateFormatValid($dateFormat, $requestedDate)) {
        	$invalidParams[] = 'requestedDate';
    	}
	}

	private function validateDevice($device, &$invalidParams): void
	{
    	if (!$this->isDeviceStringValid($device)) {
        	$invalidParams[] = 'device';
    	}
	}

	private function validateDataFromClientForTimetable($dataFromClient): void
	{
		$invalidParams = [];
		$dateFormat = 'd/m/Y';
		if (isset($dataFromClient['slotsToCheck'])) {
			$this->validateSlotsToCheck($dateFormat, $dataFromClient['slotsToCheck'], $invalidParams);
		} else {
			$this->validateRequestedDate($dateFormat, $dataFromClient['requestedDate'], $invalidParams);
			$this->validateDevice($dataFromClient['device'], $invalidParams);
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
		$dataFromClient = $this->getDataFromClient(['requestedDate', 'device']);
		$this->validateDataFromClientForTimetable($dataFromClient);
		$dataForResponse = $this->model->getSquashTimetable($dataFromClient);
		$this->sendJsonResponse($dataForResponse);
	}

	function action_check_timetable_slots(): void
	{
		if (!Controller::isAjaxRequest()) {
            Controller::sendForbiddenResponse();
        }
		$dataFromClient = $this->getDataFromClient(['slotsToCheck']);
		$this->validateDataFromClientForTimetable($dataFromClient);
		//$dataForResponse = $this->model->areSlotsAvailable($dataFromClient);
		$dataForResponse = $this->model->addTemporaryBookings($dataFromClient);
		$this->sendJsonResponse($dataForResponse);
	}

	function action_index($params): void
	{
		$this->view->generate('squash_booking_view.php');
	}
}
