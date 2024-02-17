<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <?php require_once(__DIR__ . '/common_styles_and_scripts.php'); ?>
        <link rel="stylesheet" href="/padelSquashBookingWebsite/css/squash-booking.css" />
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/CircularArray.js"></script>
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/MobileGallerySlider.js"></script>
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/DesktopGallerySlider.js"></script>
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/squash-booking.js"></script>
        <script defer type="module" src="/padelSquashBookingWebsite/scripts/timetable.js"></script>

        <!-- jQuery UI -->
        <link
            rel="stylesheet"
            href="/padelSquashBookingWebsite/css/jquery-ui.min.css"
        />
        <script defer src="/padelSquashBookingWebsite/scripts/jquery-ui.min.js"></script>
        <!-- end jQuery UI -->
        
        <title>Squash Booking</title>
    </head>
    <body>
        <div class="wrapper">
            <?php require_once(__DIR__ . '/template_header.php'); ?>
            <main class="main">
                <div class="main__preview preview">
                    <div class="preview__container _container">
                        <div class="preview__title">
                            <h1>Klaas Jan's Squash Court</h1>
                            <a href="#main__reviews" class="preview__rating">
                                <img
                                    src="/padelSquashBookingWebsite/assets/zero_stars.png"
                                    alt="Zero stars image"
                                />
                            </a>
                        </div>
                        <div class="preview__controls control">
                            <a
                                href="#main__google-geo"
                                class="control__google-geo"
                            >
                                <img
                                    src="/padelSquashBookingWebsite/assets/location.png"
                                    alt="Location icon"
                                />
                                <div>Klass Jan's squash cort adress</div>
                            </a>
                            <a
                                href="#timetable__schedule"
                                class="control__opening-time"
                            >
                                <img
                                    src="/padelSquashBookingWebsite/assets/clock.png"
                                    alt="Clock image"
                                />
                                <div>From 7:30 to 23:00</div>
                            </a>
                            <div class="control__share">
                                <img
                                    src="/padelSquashBookingWebsite/assets/share.png"
                                    alt="Share icon"
                                />
                                <div class="control__share-tooltip">Share</div>
                            </div>
                        </div>
                        <div class="preview__gallery gallery">
                            <img
                                class="gallery__image"
                                id="gallery__main"
                                src="/padelSquashBookingWebsite/assets/squash_court1.png"
                                alt="First squash court"
                            />
                            <img
                                class="gallery__image"
                                id="gallery__prev"
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                            />
                            <img
                                class="gallery__image"
                                id="gallery__next"
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                            />
                            <img
                                class="gallery__indicator"
                                id="gallery__left-pointer"
                                src="/padelSquashBookingWebsite/assets/left_pointer.png"
                                alt="Left pointer icon"
                            />
                            <img
                                class="gallery__indicator"
                                id="gallery__right-pointer"
                                src="/padelSquashBookingWebsite/assets/right_pointer.png"
                                alt="Right pointer icon"
                            />
                            <img
                                class="gallery__indicator"
                                id="gallery__price-hint"
                                src="/padelSquashBookingWebsite/assets/price_hint.png"
                                alt="Price hint image"
                            />
                        </div>
                        <div class="preview__included included">
                            <div class="included__car-parking">
                                <div>
                                    <img
                                        src="/padelSquashBookingWebsite/assets/car-parking.png"
                                        alt="Car parking icon"
                                    />
                                    Free car parking
                                </div>
                                <img
                                    src="/padelSquashBookingWebsite/assets/cross.png"
                                    alt="Cross icon"
                                />
                            </div>
                            <div class="included__shower">
                                <div>
                                    <img
                                        src="/padelSquashBookingWebsite/assets/shower.png"
                                        alt="Shower icon"
                                    />
                                    Shower
                                </div>
                                <img
                                    src="/padelSquashBookingWebsite/assets/check.png"
                                    alt="Check icon"
                                />
                            </div>
                            <div class="included__dressing-room">
                                <div>
                                    <img
                                        src="/padelSquashBookingWebsite/assets/dressing-room.png"
                                        alt="Dressing room icon"
                                    />
                                    Dressing room
                                </div>
                                <img
                                    src="/padelSquashBookingWebsite/assets/check.png"
                                    alt="Check icon"
                                />
                            </div>
                            <div class="included__equipment equipment">
                                <div>
                                    <img
                                        src="/padelSquashBookingWebsite/assets/equipment.png"
                                        alt="Equipment icon"
                                    />
                                    Inventory
                                </div>
                                <div class="equipment__tooltip">
                                    3 items
                                    <ul>
                                        <li>Squash rackets</li>
                                        <li>Squash balls</li>
                                        <li>Squash shoes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main__timetable timetable">
                    <div class="timetable__container _container">
                        <div id="timetable__schedule" class="timetable__opening-hours">
                            
                        </div>
                    </div>
                </div>
                <div class="main__reviews review">
                    <div class="review__container _container">
                    </div>
                </div>
                <div class="main__google-geo google-geo">
                    <div class="google-geo__container _wide-container">
                        <iframe 
                            width="100%" 
                            height="400" 
                            frameborder="0" 
                            scrolling="no" 
                            marginheight="0" 
                            marginwidth="0" 
                            src="https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&amp;layer=mapnik">
                        </iframe>
                        <!--src="https://www.openstreetmap.org/search?query=Hoekseize%2022%2C%208711%20HR%20Workum"-->
                    </div>
                </div>
            </main>
            <?php require_once(__DIR__ . '/template_footer.php'); ?>
        </div>
    </body>
</html>
