<?php
class Model_Squash_Booking extends Model
{
	private function getWeekFromDate($requestedDate, $format): array
	{
		$requestedWeek[] = $requestedDate;
		$date = DateTime::createFromFormat($format, $requestedDate);
		for ($i = 0; $i < 6; $i++) {
			$date->modify('+1 day');
			$requestedWeek[] = $date->format($format);
		}
		return $requestedWeek;
	}
	
	private function getCollectionForSquashTimetable($requestedDayOrWeek): MongoDB\Driver\Cursor
	{
		$sportcentrumusers = Model::getSportcentrumUsersCollection();
		$filter = [];
		$options = [];
		if (is_array($requestedDayOrWeek)) {
			$orConditions = [];
			foreach ($requestedDayOrWeek as $date) {
    			$orConditions[] = ['bookings.squash.' . $date => ['$exists' => true]];
			}
			$filter = ['$or' => $orConditions];
			$projection = ['_id' => 0];
			foreach ($requestedDayOrWeek as $date) {
    			$projection['bookings.squash.' . $date] = 1;
			}
			$options = ['projection' => $projection];
		}
		else
		{
			$filter = ['bookings.squash.' . $requestedDayOrWeek => ['$exists' => true]];
			$options = ['projection' => ['_id' => 0, 'bookings.squash.' . $requestedDayOrWeek => 1]];
		}
		return $sportcentrumusers->find($filter, $options);;
	}

	private function getAlreadyBookedSquashTimes($requestedDate, $device): array
	{
		$requestedDateData = [];
		if($device === 'mobile')
		{
			$collectionForSquashTimetable = $this->getCollectionForSquashTimetable($requestedDate, $device);
			$requestedDateData[$requestedDate] = [];
			foreach ($collectionForSquashTimetable as $document) {
				$alreadyBookedTimes = iterator_to_array($document['bookings']['squash'][$requestedDate]);
				$requestedDateData[$requestedDate] = array_merge($requestedDateData[$requestedDate], $alreadyBookedTimes);
			}
		}
		else if($device === "desktop")
		{
			$requestedWeek = $this->getWeekFromDate($requestedDate, 'd/m/Y');
			$collectionForSquashTimetable = $this->getCollectionForSquashTimetable($requestedWeek, $device);
			$requestedDateData = array_fill_keys($requestedWeek, []);
			foreach ($collectionForSquashTimetable as $document) {
				foreach ($requestedWeek as $date) {
					if(!isset($document['bookings']['squash'][$date])) {continue;}
					$alreadyBookedTimes = iterator_to_array($document['bookings']['squash'][$date]);
					$requestedDateData[$date] = array_merge($requestedDateData[$date], $alreadyBookedTimes);
				}
			}
		}
		return $requestedDateData;
	}

	public function getSquashTimetable($options): array
	{
		$requestedDate = $options['requestedDate'];
		$device = $options['device'];
		return $this->getAlreadyBookedSquashTimes($requestedDate, $device);
	}

	public function get_data($options): void
	{
    }
}