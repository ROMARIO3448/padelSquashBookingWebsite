<?php

use PHPUnit\Framework\TestCase;
require_once './application/core/controller.php';
require_once './application/core/model.php';
require_once './application/core/view.php';
require_once './application/models/model_squash_booking.php';
require_once './application/controllers/controller_squash_booking.php';
//./vendor/bin/phpunit tests/controllers/controller_squash_booking_test.php

class Controller_Squash_Booking_Test extends TestCase
{
    private $controllerSquashBooking;

    protected function setUp(): void
    {
        $this->controllerSquashBooking = new Controller_Squash_Booking();
    }

    protected function tearDown(): void
    {
        $_GET = [];
        $_POST = [];
    }

    private function requestedDateProvider(): array
    {
        return [
            ['d/m/Y', '01/01/2030', true],
            ['d/m/Y', '26/07/2000', false],
            ['d/m/Y', '2024-01-01', false],
            ['Y-m-d', '2030-01-01', true],
            ['Y-m-d', '26/07/2000', false],
            ['invalid', '2024-01-01', false],
            ['d/m/Y', 'invalid', false],
        ];
    }

    /**
     * @dataProvider requestedDateProvider
     */
    public function testRequestedDate(string $dateFormat, string $requestedDate, bool $expectedBoolean): void
    {
        $method = new ReflectionMethod(Controller_Squash_Booking::class, 'isRequestedDateNotPastAndDateFormatValid');
        $method->setAccessible(true);
        $result = $method->invoke($this->controllerSquashBooking, $dateFormat, $requestedDate);
        $this->assertEquals($expectedBoolean, $result);
    }

    /*-------------------------------------------------------------------------*/
    private function timeSlotsProvider(): array
    {
        $firstTrueSlot = [
            '13/06/2023' => [
                "7:30 - 8:00",
                "11:00 - 11:30"
            ],
            '14/06/2023' => [
                "19:30 - 20:00",
                "20:00 - 20:30"
            ],
        ];

        $secondTrueSlot = [
            'invalid' => [
                "7:30 - 8:00"
            ],
            'invalid' => [
                "16:30 - 17:00",
                "17:00 - 17:30",
                "19:30 - 20:00",
                "20:00 - 20:30"
            ],
        ];

        $thirdTrueSlot = [
            '14/06/2023' => [
            ],
            '22/06/2023' => [
                "16:30 - 17:00",
            ],
        ];

        $firstFalseSlot = [
            '18/06/2023' => [
                "7:30- 8:00",
                "11:00 - 11.30"
            ]
        ];

        $secondFalseSlot = [
            '14/06/2023' => [
                "56:30 - 17:00",
                "90:00 - 20:70"
            ],
            '22/06/2023' => [
                "16:30 - 17:00",
                "17:00 - 17:30",
            ],
        ];

        $thirdFalseSlot = [
            '14/06/2023' => [
                "",
                55,
            ],
            '22/06/2023' => [
                "16:30 - 17:00",
            ]
        ];
        
        return [
            [$firstTrueSlot, true],
            [$secondTrueSlot, true],
            [$thirdTrueSlot, true],
            [$firstFalseSlot, false],
            [$secondFalseSlot, false],
            [$thirdFalseSlot, false],
        ];
    }

    /**
     * @dataProvider timeSlotsProvider
     */
    public function testTimeSlots(array $slotsToCheck, bool $expectedBoolean): void
    {
        $method = new ReflectionMethod(Controller_Squash_Booking::class, 'areTimeSlotsValid');
        $method->setAccessible(true);
        $result = $method->invoke($this->controllerSquashBooking, $slotsToCheck);
        $this->assertEquals($expectedBoolean, $result);
    }

    /*---------------------------------------------------------------*/
    private function rawDataProvider(): array
    {
        return [
            ['param1', 'getValue', 'postValue', 'getValue'],
            ['param2', null, 'postValue', 'postValue'],
            ['param3', null, null, null],
        ];
    }

    /**
     * @dataProvider rawDataProvider
     */
    public function testRawData(string $paramName, mixed $getData, mixed $postData, mixed $expectedData): void
    {
        $_GET[$paramName] = $getData;
        $_POST[$paramName] = $postData;
        $method = new ReflectionMethod(Controller_Squash_Booking::class, 'getRawDataFromClient');
        $method->setAccessible(true);
        $result = $method->invoke($this->controllerSquashBooking, $paramName);
        $this->assertEquals($expectedData, $result);
    }

    /*------------------------------------------------------------------*/
    private function allDatesProvider(): array
    {
        return [
            ['d/m/Y', ['01/01/2030'], true],
            ['d/m/Y', ['01/01/2030', '26/07/2035'], true],
            ['Y-m-d', ['2030-01-01', '2034-01-01'], true],
            ['d/m/Y', ['01/01/2030', '26/07/2000'], false],
            ['d/m/Y', ['26/07/2030', '2034-01-01'], false],
            ['Y-m-d', ['01/01/2030', '26/07/2030'], false],
            ['invalid', ['2034-01-01'], false],
            ['d/m/Y', ['invalid'], false],
        ];
    }

    /**
     * @dataProvider allDatesProvider
     */
    public function testAllDates(string $dateFormat, array $dates, bool $expectedBoolean): void
    {
        $method = new ReflectionMethod(Controller_Squash_Booking::class, 'areAllDatesValid');
        $method->setAccessible(true);
        $result = $method->invoke($this->controllerSquashBooking, $dateFormat, $dates);
        $this->assertEquals($expectedBoolean, $result);
    }

    /*------------------------------------------------------------------*/
    private function deviceStringProvider(): array
    {
        return [
            ['mobile', true],
            ['desktop', true],
            ['', false]
        ];
    }

    /**
     * @dataProvider deviceStringProvider
     */
    public function testDeviceString(string $deviceString, bool $expectedBoolean): void
    {
        $method = new ReflectionMethod(Controller_Squash_Booking::class, 'isDeviceStringValid');
        $method->setAccessible(true);
        $result = $method->invoke($this->controllerSquashBooking, $deviceString);
        $this->assertEquals($expectedBoolean, $result);
    }
}
