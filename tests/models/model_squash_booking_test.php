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

    public function weekFromDateProvider(): array
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
    public function testGetWeekFromDate($requestedDate, $format, $expectedWeek): void
    {
        $method = new ReflectionMethod(Model_Squash_Booking::class, 'getWeekFromDate');
        $method->setAccessible(true);
        $result = $method->invoke($this->modelSquashBooking, $requestedDate, $format);
        $this->assertEquals($expectedWeek, $result);
    }
}
