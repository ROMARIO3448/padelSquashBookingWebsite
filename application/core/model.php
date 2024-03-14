<?php
class Model
{
    protected static $client;

    protected static function getClient()
    {
        if (self::$client === null) {
            self::$client = new MongoDB\Client;
        }
        return self::$client;
    }

    protected static function getSportcentrumUsersCollection()
    {
        return self::getClient()->sportcentrum->sportcentrumusers;
    }

    protected static function getSportcentrumTemporaryBookings()
    {
        return self::getClient()->sportcentrum->temporarybookings;
    }
    
    public function get_data($options)
    {
    }
}
