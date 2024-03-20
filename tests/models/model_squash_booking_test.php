<?php

use PHPUnit\Framework\TestCase;
require_once './application/core/model.php';
require_once './application/models/model_squash_booking.php';
//./vendor/bin/phpunit tests/models/model_squash_booking_test.php

class Model_Squash_Booking_Test extends TestCase
{
    private $modelSquashBooking;

    protected function setUp(): void
    {
        $this->modelSquashBooking = new Model_Squash_Booking();
    }

    protected function tearDown(): void
    {
        
    }

    private function weekFromDateProvider(): array
    {
        return [
            ['01/01/2024', 'd/m/Y', ['01/01/2024', '02/01/2024', '03/01/2024', '04/01/2024', '05/01/2024', '06/01/2024', '07/01/2024']],
            ['26/07/2000', 'd/m/Y', ['26/07/2000', '27/07/2000', '28/07/2000', '29/07/2000', '30/07/2000', '31/07/2000', '01/08/2000']],
            ['2024-01-01', 'Y-m-d', ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07']],
            ['2000-07-26', 'Y-m-d', ['2000-07-26', '2000-07-27', '2000-07-28', '2000-07-29', '2000-07-30', '2000-07-31', '2000-08-01']],
        ];
    }

    /**
     * @dataProvider weekFromDateProvider
     */
    public function testGetWeekFromDate(string $requestedDate, string $format, array $expectedWeek): void
    {
        $method = new ReflectionMethod(Model_Squash_Booking::class, 'getWeekFromDate');
        $method->setAccessible(true);
        $result = $method->invoke($this->modelSquashBooking, $requestedDate, $format);
        $this->assertEquals($expectedWeek, $result);
    }

    /*-----------------------------------------------------------------------*/
    private function filterForSquashTimetableProvider(): array
    {
        return [
            [['01/01/2024'], ['$or' => [['bookings.squash.01/01/2024' => ['$exists' => true]]]]],
            [['02/01/2024', '03/01/2024'], ['$or' => [
                ['bookings.squash.02/01/2024' => ['$exists' => true]],
                ['bookings.squash.03/01/2024' => ['$exists' => true]]
            ]]],
            [['invalid'], ['$or' => [['bookings.squash.invalid' => ['$exists' => true]]]]],
            [[], ['$or' => []]],
        ];
    }

    /**
     * @dataProvider filterForSquashTimetableProvider
     */
    public function testFilterForSquashTimetableBuilder(array $requestedDayOrWeek, array $expectedFilter): void
    {
        $method = new ReflectionMethod(Model_Squash_Booking::class, 'buildFilterForSquashTimetable');
        $method->setAccessible(true);
        $result = $method->invoke($this->modelSquashBooking, $requestedDayOrWeek);
        $this->assertEquals($expectedFilter, $result);
    }

    /*-----------------------------------------------------------------------*/
    private function optionsForSquashTimetableProvider(): array
    {
        return [
            [['01/01/2024'], ['projection' => ['bookings.squash.01/01/2024' => 1, '_id' => 0]]],
            [['02/01/2024', '03/01/2024'], ['projection' => [
                'bookings.squash.02/01/2024' => 1,
                'bookings.squash.03/01/2024' => 1,
                '_id' => 0
            ]]],
            [['invalid'], ['projection' => ['bookings.squash.invalid' => 1, '_id' => 0]]],
            [[], ['projection' => ['_id' => 0]]],
        ];
    }

    /**
     * @dataProvider optionsForSquashTimetableProvider
     */
    public function testOptionsForSquashTimetableBuilder(array $requestedDayOrWeek, array $expectedOptions): void
    {
        $method = new ReflectionMethod(Model_Squash_Booking::class, 'buildOptionsForSquashTimetable');
        $method->setAccessible(true);
        $result = $method->invoke($this->modelSquashBooking, $requestedDayOrWeek);
        $this->assertEquals($expectedOptions, $result);
    }

    /*-----------------------------------------------------------------------*/
    private function slotsAvailabilityFilterProvider(): array
    {
        return [
            [
                ['13/06/2023' => ["7:30 - 8:00", "11:00 - 11:30"]],
                ['$or' => [
                    ['bookings.squash.13/06/2023' => ['$in' => ["7:30 - 8:00", "11:00 - 11:30"]]]
                ]]
            ],
            [
                ['13/06/2023' => ["7:30 - 8:00", "11:00 - 11:30"], 
                '14/06/2023' => ["19:30 - 20:00", "20:00 - 20:30"]],
                ['$or' => [
                    ['bookings.squash.13/06/2023' => ['$in' => ["7:30 - 8:00", "11:00 - 11:30"]]],
                    ['bookings.squash.14/06/2023' => ['$in' => ["19:30 - 20:00", "20:00 - 20:30"]]]
                ]]
            ],
            [
                ['invalid' => ["invalid", "invalid"]],
                ['$or' => [
                    ['bookings.squash.invalid' => ['$in' => ["invalid", "invalid"]]]
                ]]
            ],
            [
                [],
                ['$or' => []]
            ],
        ];
    }

    /**
     * @dataProvider slotsAvailabilityFilterProvider
     */
    public function testSlotsAvailabilityFilterBuilder(array $slotsToCheck, array $expectedFilter): void
    {
        $method = new ReflectionMethod(Model_Squash_Booking::class, 'buildSlotsAvailabilityFilter');
        $method->setAccessible(true);
        $result = $method->invoke($this->modelSquashBooking, $slotsToCheck);
        $this->assertEquals($expectedFilter, $result);
    }
}
