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

	private function buildFilterForSquashTimetable($requestedDayOrWeek): array
	{
		$orConditions = [];
		foreach ($requestedDayOrWeek as $date) {
			$orConditions[] = ['bookings.squash.' . $date => ['$exists' => true]];
		}
		return ['$or' => $orConditions];
	}

	private function buildOptionsForSquashTimetable($requestedDayOrWeek): array
	{
		$projection = ['_id' => 0];
		foreach ($requestedDayOrWeek as $date) {
			$projection['bookings.squash.' . $date] = 1;
		}
		return ['projection' => $projection];
	}
	
	private function getCollectionForSquashTimetable($requestedDayOrWeek): MongoDB\Driver\Cursor
	{
		$sportcentrumusers = Model::getSportcentrumUsersCollection();
    	$filter = $this->buildFilterForSquashTimetable($requestedDayOrWeek);
    	$options = $this->buildOptionsForSquashTimetable($requestedDayOrWeek);
    	return $sportcentrumusers->find($filter, $options);
	}

	private function getAlreadyBookedSquashSlots($requestedDayOrWeek): array
	{
		$collectionForSquashTimetable = $this->getCollectionForSquashTimetable($requestedDayOrWeek);
		$requestedDateData = array_fill_keys($requestedDayOrWeek, []);
		foreach ($collectionForSquashTimetable as $document) {
			foreach ($requestedDayOrWeek as $date) {
				if(!isset($document['bookings']['squash'][$date])) {continue;}
				$alreadyBookedTimes = iterator_to_array($document['bookings']['squash'][$date]);
				$requestedDateData[$date] = array_merge($requestedDateData[$date], $alreadyBookedTimes);
			}
		}
		return $requestedDateData;
	}

	public function getSquashTimetable($options): array
	{
		$requestedDate = $options['requestedDate'];
		$device = $options['device'];
		$requestedDayOrWeek = $device === 'mobile' ? [$requestedDate] : $this->getWeekFromDate($requestedDate, 'd/m/Y');
		return $this->getAlreadyBookedSquashSlots($requestedDayOrWeek);
	}

	private function buildSlotsAvailabilityFilter($slotsToCheck): array
    {
        $orConditions = [];
        foreach ($slotsToCheck as $date => $times) {
            $orConditions[] = ['bookings.squash.' . $date => ['$in' => $times]];
        }
        return ['$or' => $orConditions];
    }

    private function getFilteredDocumentsCount($filter): int
    {
        $sportcentrumusers = Model::getSportcentrumUsersCollection();
        return $sportcentrumusers->countDocuments($filter);
    }

	private function areSlotsAvailable($slotsToCheck): bool
    {
        $filter = $this->buildSlotsAvailabilityFilter($slotsToCheck);
        $count = $this->getFilteredDocumentsCount($filter);
        return $count === 0;
    }

	private function insertTemporaryBookings($slotsToCheck): void
    {
        $temporarybookings = Model::getSportcentrumTemporaryBookings();
        $document = [
            '_id' => new MongoDB\BSON\ObjectID(),
            'createdAt' => new MongoDB\BSON\UTCDateTime(),
            'bookings' => ['squash' => $slotsToCheck]
        ];
        $temporarybookings->insertOne($document);
    }

	public function addTemporaryBookings($options): void
    {
        $slotsToCheck = $options['slotsToCheck'];
		if($this->areSlotsAvailable($slotsToCheck))
		{
			$this->insertTemporaryBookings($slotsToCheck);
		}
    }

	public function get_data($options): void
	{
    }
}