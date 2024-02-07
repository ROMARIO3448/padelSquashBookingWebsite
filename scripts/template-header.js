jQuery(function () {
    const headerTemplate = $(".header-template");
    const headerTemplateLogo = $(".header-template__logo");
    const headerTemplateMenu = $(".header-template__menu");
    const headerTemplateActions = $(".header-template__actions");
    const headerTemplateBurger = $(".header-template__burger");

    headerTemplateBurger.on("click", function () {
        headerTemplate.toggleClass("active");
        headerTemplateLogo.toggleClass("active");
        headerTemplateMenu.toggleClass("active");
        headerTemplateActions.toggleClass("active");
        headerTemplateBurger.toggleClass("active");
    });
});
