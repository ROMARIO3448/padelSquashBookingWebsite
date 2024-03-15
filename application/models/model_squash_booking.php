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
	
	private function getCollectionForSquashTimetable($requestedDayOrWeek, $isTemporary): MongoDB\Driver\Cursor
	{
		$collection = $isTemporary ? Model::getSportcentrumTemporaryBookingsCollection() : Model::getSportcentrumUsersCollection();
    	$filter = $this->buildFilterForSquashTimetable($requestedDayOrWeek);
    	$options = $this->buildOptionsForSquashTimetable($requestedDayOrWeek);
    	return $collection->find($filter, $options);
	}

	private function getAlreadyBookedSquashSlots($requestedDayOrWeek, $isTemporary = false): array
	{
		$collectionForSquashTimetable = $this->getCollectionForSquashTimetable($requestedDayOrWeek, $isTemporary);
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
		return array_merge_recursive($this->getAlreadyBookedSquashSlots($requestedDayOrWeek), $this->getAlreadyBookedSquashSlots($requestedDayOrWeek, true));
	}

	private function buildSlotsAvailabilityFilter($slotsToCheck): array
    {
        $orConditions = [];
        foreach ($slotsToCheck as $date => $times) {
            $orConditions[] = ['bookings.squash.' . $date => ['$in' => $times]];
        }
        return ['$or' => $orConditions];
    }

    private function getFilteredDocumentsCount($filter, $isTemporary = false): int
    {
        $collection = $isTemporary ? Model::getSportcentrumTemporaryBookingsCollection() : Model::getSportcentrumUsersCollection();
        return $collection->countDocuments($filter);
    }

	private function areSlotsAvailable($slotsToCheck): bool
    {
        $filter = $this->buildSlotsAvailabilityFilter($slotsToCheck);
        $count = $this->getFilteredDocumentsCount($filter) + $this->getFilteredDocumentsCount($filter, true);
        return $count === 0;
    }

	private function insertTemporaryBookings($slotsToCheck): ?MongoDB\InsertOneResult
    {
		try {
			$temporarybookings = Model::getSportcentrumTemporaryBookingsCollection();
			$document = [
				'_id' => new MongoDB\BSON\ObjectID(),
				'createdAt' => new MongoDB\BSON\UTCDateTime(),
				'bookings' => ['squash' => $slotsToCheck]
			];
			$result = $temporarybookings->insertOne($document);
			return $result;
		} catch (MongoDB\Driver\Exception\Exception $e) {
			return null;
		}
    }

	private function storeTempDataInSession($slotsToCheck): void
	{
		session_start();
		$tempUserId = uniqid('tempUser_', true);
		$_SESSION['tempUserId'] = $tempUserId;
		$_SESSION['slotsToPay'] = $slotsToCheck;
		session_write_close();
	}

	public function addTemporaryBookings($options): bool
    {
        $slotsToCheck = $options['slotsToCheck'];
		if($this->areSlotsAvailable($slotsToCheck))
		{
			if($this->insertTemporaryBookings($slotsToCheck) !== null)
			{
				$this->storeTempDataInSession($slotsToCheck);
				return true;
			}
		}
		return false;
    }

	public function get_data($options): void
	{
    }
}