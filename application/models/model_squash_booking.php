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
				foreach ($document['bookings']['squash'][$requestedDate] as $alreadyBookedTime)
				{
					$requestedDateData[$requestedDate][] = $alreadyBookedTime;
				}
			}
		}
		else if($device === "desktop")
		{
			$requestedWeek = $this->getWeekFromDate($requestedDate, 'd/m/Y');
			$collectionForSquashTimetable = $this->getCollectionForSquashTimetable($requestedWeek, $device);
			foreach ($requestedWeek as $date) {
				$requestedDateData[$date] = [];
			}
			foreach ($collectionForSquashTimetable as $document) {
				foreach ($requestedWeek as $date) {
					if (isset($document['bookings']['squash'][$date])) {
						foreach ($document['bookings']['squash'][$date] as $alreadyBookedTime)
						{
							$requestedDateData[$date][] = $alreadyBookedTime;
						}
					}
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