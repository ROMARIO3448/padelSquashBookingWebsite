<?php
use PHPMailer\PHPMailer\PHPMailer;

class MyPHPMailer {
    private static string $smtpHost;
    private static string $smtpUsername;
    private static string $smtpPassword;
    private static bool $isEnvLoaded = false;

    private static int $gmailSmtpSslPort = 465;
    private static string $smtpConnectionType = "ssl";
    private static string $envFilePath = 'C:/xampp/htdocs/padelSquashBookingWebsite/.env';
    private static string $defaultEmailAddress = "clanwarexperiment@gmail.com";

    private static function loadEnv(): void 
    {
        if (!self::$isEnvLoaded) {
            $env = parse_ini_file(self::$envFilePath);
            self::$smtpHost = $env['SMTP_HOST'] ?? '';
            self::$smtpUsername = $env['SMTP_USERNAME'] ?? '';
            self::$smtpPassword = $env['SMTP_PASSWORD'] ?? '';
            self::$isEnvLoaded = true;
        }
    }

    static public function sendMail(string $subject, string $body, string $emailAddress = null): bool 
    {
        self::loadEnv();
        $emailAddress = $emailAddress ?? self::$defaultEmailAddress;

        $mail = new PHPMailer();
        
        $mail->isSMTP();
        $mail->Host = self::$smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = self::$smtpUsername;
        $mail->Password = self::$smtpPassword;
        $mail->SMTPSecure = self::$smtpConnectionType;
        $mail->Port = self::$gmailSmtpSslPort;

        $mail->setFrom(self::$smtpUsername);
        $mail->addAddress($emailAddress);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;

        if (!$mail->send()) {
            return false;
        }
        return true;
    }
}
