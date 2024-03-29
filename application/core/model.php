<?php
use MongoDB\Client;
use MongoDB\Collection;
use MongoDB\Driver\Exception\Exception;
use MongoDB\Driver\Cursor;
use MongoDB\InsertOneResult;

class Model
{
    protected static ?Client $client = null;

    protected static function getClient(): ?Client
    {
        if (self::$client === null) {
            try {
                self::$client = new Client;
            } catch (Exception $e) {
                $callerFunction = __FUNCTION__;
                MyPHPMailer::sendMail("$callerFunction failed", $e->getMessage());
                return null;
            }
        }
        return self::$client;
    }

    protected static function countDocumentsInCollection(Collection $collection, array $filter = [], array $options = []): ?int
    {
        try {
            return $collection->countDocuments($filter, $options);
        }
        catch (Exception $e) {
            $callerFunction = __FUNCTION__;
            MyPHPMailer::sendMail("$callerFunction failed", $e->getMessage());
            return null;
        }
    }

    protected static function findDocumentsInCollection(Collection $collection, array $filter = [], array $options = []): ?Cursor
    {
        try {
            return $collection->find($filter, $options);
        }
        catch (Exception $e) {
            $callerFunction = __FUNCTION__;
            MyPHPMailer::sendMail("$callerFunction failed", $e->getMessage());
            return null;
        }
    }

    protected static function insertOneInCollection(Collection $collection, $document, array $options = []): ?InsertOneResult
    {
        try {
            return $collection->insertOne($document, $options);
        }
        catch (Exception $e) {
            $callerFunction = __FUNCTION__;
            MyPHPMailer::sendMail("$callerFunction failed", $e->getMessage());
            return null;
        }
    }

    protected static function getSportcentrumUsersCollection(): Collection
    {
        return self::getClient()->sportcentrum->sportcentrumusers;
    }

    protected static function getSportcentrumTemporaryBookingsCollection(): Collection
    {
        return self::getClient()->sportcentrum->temporarybookings;
    }
    
    public function get_data(array $options)
    {
    }
}
