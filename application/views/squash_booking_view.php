<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <?php require_once(__DIR__ . '/common_styles_and_scripts.php'); ?>
        <link rel="stylesheet" href="/padelSquashBookingWebsite/css/squash-booking.css" />
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/CircularArray.js"></script>
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/squash-booking.js"></script>
        <title>Squash Booking</title>
    </head>
    <body>
        <div class="wrapper">
            <?php require_once(__DIR__ . '/template_header.php'); ?>
            <main class="main">
                <div class="squash-booking _container">
                    <div class="squash-booking__preview preview">
                        <div class="preview__title">
                            <h1>Klaas Jan's Squash Court</h1>
                            <div class="preview__rating">
                                <a href="#squash-booking__reviews">
                                    <ul>
                                        <li><img src="/padelSquashBookingWebsite/assets/star.png" alt="Empty star image"/></li>
                                        <li><img src="/padelSquashBookingWebsite/assets/star.png" alt="Empty star image"/></li>
                                        <li><img src="/padelSquashBookingWebsite/assets/star.png" alt="Empty star image"/></li>
                                        <li><img src="/padelSquashBookingWebsite/assets/star.png" alt="Empty star image"/></li>
                                        <li><img src="/padelSquashBookingWebsite/assets/star.png" alt="Empty star image"/></li>
                                    </ul>
                                </a>
                            </div>
                        </div>
                        <div class="preview__controls control">
                            <div class="control__google-geo">
                                <a href="#squash-booking__google-geo">
                                    <img src="/padelSquashBookingWebsite/assets/location.png" alt="Location icon"/>
                                    <div>Klass Jan's squash cort adress</div>
                                </a>
                            </div>
                            <div class="control__opening-time">
                                <a href="#squash-booking__opening-time">
                                    <img src="/padelSquashBookingWebsite/assets/clock.png" alt="Clock image"/>
                                    <div>From 7:30 to 23:00</div>
                                </a>
                            </div>
                            <div class="control__share">
                                <img src="/padelSquashBookingWebsite/assets/share.png" alt="Share icon"/>
                                <div class="control__share-tooltip">Share</div>
                            </div>
                        </div>
                        <div class="preview__gallery gallery">
                            <img class="gallery__main" src="/padelSquashBookingWebsite/assets/squash_court1.png" alt="First squash court" />
                            <img class="gallery__prev" 
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
                            <img class="gallery__next" 
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
                            <img class="gallery__left-pointer" src="/padelSquashBookingWebsite/assets/left_pointer.png" alt="Left pointer icon" />
                            <img class="gallery__right-pointer" src="/padelSquashBookingWebsite/assets/right_pointer.png" alt="Right pointer icon" />
                            <img class="gallery__price-hint" src="/padelSquashBookingWebsite/assets/price_hint.png" alt="Price hint image" />
                        </div>
                        <div class="preview__included included">
                            <div class="included__car-parking">
                                <div>
                                    <img src="/padelSquashBookingWebsite/assets/car-parking.png" alt="Car parking icon"/>
                                    Free car parking
                                </div>
                                <img src="/padelSquashBookingWebsite/assets/cross.png" alt="Car parking icon"/>
                            </div>
                            <div class="included__shower">
                                <div>
                                    <img src="/padelSquashBookingWebsite/assets/shower.png" alt="Shower icon"/>
                                    Shower
                                </div>
                                <img src="/padelSquashBookingWebsite/assets/check.png" alt="Car parking icon"/>
                            </div>
                            <div class="included__dressing-room">
                                <div>
                                    <img src="/padelSquashBookingWebsite/assets/dressing-room.png" alt="Dressing room icon"/>
                                    Dressing room
                                </div>
                                <img src="/padelSquashBookingWebsite/assets/check.png" alt="Car parking icon"/>
                            </div>
                        </div>
                    </div>
                    <div class="squash-booking__timetable timetable">
                    </div>
                    <div id="#squash-booking__reviews" class="squash-booking__reviews review">
                    </div>
                    <div id="#squash-booking__google-geo" class="squash-booking__google-geo google-geo">
                    </div>
                </div>
            </main>
            <?php require_once(__DIR__ . '/template_footer.php'); ?>
        </div>
    </body>
</html>
