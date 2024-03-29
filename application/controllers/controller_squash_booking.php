<?php

class Controller_Squash_Booking extends Controller
{
	function __construct()
	{
		parent::__construct();
		$this->model = new Model_Squash_Booking();
	}

	private function sendJsonResponse(mixed $dataForResponse, int $responseCode = 200): void
    {
        header("Content-Type: application/json");
		http_response_code($responseCode);
        echo json_encode($dataForResponse);
        exit();
    }
	
	private function sendBadRequestJsonResponse(array $missingParams = [], array $invalidParams = []): void
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

	private function getRawDataFromClient(string $paramName): mixed
	{
		$dataFromClient = $_GET[$paramName] ?? $_POST[$paramName] ?? null;
		if (empty($dataFromClient)) {
			$jsonArray = json_decode(file_get_contents("php://input"), true);
			if ($jsonArray !== null && isset($jsonArray[$paramName]) 
				&& json_last_error() === JSON_ERROR_NONE) {
				$dataFromClient = $jsonArray[$paramName];
			} else {
				return null;
			}
        }
		return $dataFromClient;
	}

	private function getDataFromClient(array $expectedParams): array
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

	private function isRequestedDateNotPastAndDateFormatValid(string $dateFormat, string $requestedDate): bool
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

	private function areAllDatesValid(string $dateFormat, array $dates): bool
	{
		foreach ($dates as $date) {
			if (!$this->isRequestedDateNotPastAndDateFormatValid($dateFormat, $date)) {
				return false;
			}
		}
		return true;
	}

	private function isDeviceStringValid(string $deviceString): bool
	{
		return ($deviceString === "mobile" || $deviceString === "desktop") ? true : false;
	}

	private function areTimeSlotsValid(array $slotsToCheck): bool
	{
		$counter = 0;
		$timeRegex = '/^([01]?[0-9]|2[0-3]):[0-5][0-9]\s-\s([01]?[0-9]|2[0-3]):[0-5][0-9]$/';
		foreach ($slotsToCheck as $times) {
			foreach ($times as $time) {
				$counter++;
				if (!preg_match($timeRegex, $time)) {
					return false;
				}
			}
		}
		if ($counter === 0) return false;
		return true;
	}

	private function validateSlotsToCheck(string $dateFormat, array $slotsToCheck, array &$invalidParams): void
	{
    	if (!is_array($slotsToCheck) || empty($slotsToCheck) 
		|| !$this->areAllDatesValid($dateFormat, array_keys($slotsToCheck))
		|| !$this->areTimeSlotsValid($slotsToCheck)) {
        	$invalidParams[] = 'slotsToCheck';
    	}
	}

	private function validateRequestedDate(string $dateFormat, string $requestedDate, array &$invalidParams): void
	{
    	if (!$this->isRequestedDateNotPastAndDateFormatValid($dateFormat, $requestedDate)) {
        	$invalidParams[] = 'requestedDate';
    	}
	}

	private function validateDevice(string $device, array &$invalidParams): void
	{
    	if (!$this->isDeviceStringValid($device)) {
        	$invalidParams[] = 'device';
    	}
	}

	private function validateDataFromClientForTimetable(array $dataFromClient): void
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

	public function action_init_timetable(): void
	{
		if (!Controller::isAjaxRequest()) {
            Controller::sendForbiddenResponse();
        }
		$dataFromClient = $this->getDataFromClient(['requestedDate', 'device']);
		$this->validateDataFromClientForTimetable($dataFromClient);
		$dataForResponse = $this->model->getSquashTimetable($dataFromClient);
		$this->sendJsonResponse($dataForResponse);
	}

	public function action_check_timetable_slots(): void
	{
		if (!Controller::isAjaxRequest()) {
            Controller::sendForbiddenResponse();
        }
		$dataFromClient = $this->getDataFromClient(['slotsToCheck']);
		$this->validateDataFromClientForTimetable($dataFromClient);
		$hasBookingSucceed = $this->model->addTemporaryBookings($dataFromClient);
		[$responseMessage, $responseCode] = $hasBookingSucceed ? 
		["These time slots are available. You have 30 minutes to complete the payment.", 201] : 
		["Someone had already booked these time slots.", 409];
    	$this->sendJsonResponse($responseMessage, $responseCode);
	}

	public function action_index($params): void
	{
		$this->view->generate('squash_booking_view.php');
	}
}
