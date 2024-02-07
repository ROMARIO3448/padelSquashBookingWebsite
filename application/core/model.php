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
    
    public function get_data($options)
    {
    }
}
