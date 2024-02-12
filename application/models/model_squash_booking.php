<?php
class Model_Squash_Booking extends Model
{
	public function getSquashTimetable($options): array
	{
		$requestedDate = $options['requestedDate'];
		$requestedDateData = [];
		if($options['device'] === "mobile")
		{
			$filter = ['bookings.squash.' .$requestedDate => ['$exists' => true]];
			$options = ['projection' => ['_id' => 0, 'bookings.squash.' . $requestedDate => 1]];
			$sportcentrumusers = Model::getSportcentrumUsersCollection();
			$findResults = $sportcentrumusers->find($filter, $options);
			$requestedDateData[$requestedDate] = [];
			foreach ($findResults as $document) {
				foreach ($document['bookings']['squash'][$requestedDate] as $alreadyBookedTime)
				{
					$requestedDateData[$requestedDate][] = $alreadyBookedTime;
				}
			}
		}
		else if($options['device'] === "desktop")
		{
			$dateString = $requestedDate;
			$requestedWeek[] = $requestedDate;
			$date = DateTime::createFromFormat('d/m/Y', $dateString);
			for ($i = 0; $i < 6; $i++) {
				$date->modify('+1 day');
				$requestedWeek[] = $date->format('d/m/Y');
			}

			$sportcentrumusers = Model::getSportcentrumUsersCollection();
			$orConditions = [];
			$filter = [];
			foreach ($requestedWeek as $date) {
    			$orConditions[] = ['bookings.squash.' . $date => ['$exists' => true]];
			}
			$filter = ['$or' => $orConditions];
			$projection = ['_id' => 0];
			foreach ($requestedWeek as $date) {
    			$projection['bookings.squash.' . $date] = 1;
				$requestedDateData[$date] = [];
			}
			$options = ['projection' => $projection];
			$findResults = $sportcentrumusers->find($filter, $options);

			foreach ($findResults as $document) {
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

	public function get_data($options): void
	{
    }
}