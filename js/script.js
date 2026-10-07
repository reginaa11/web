/* =========================================================
   Лабораторная работа №3 — jQuery + тема
   ========================================================= */
$(function () {
    'use strict';

    /* =======================================================
       1. ВЫПАДАЮЩЕЕ МЕНЮ
       ======================================================= */
    $('[data-js="menu-toggle"]').on('click', function () {
        $(this).toggleClass('is-active');
        $('[data-js="main-nav"]').stop(true, true).slideToggle(250);
    });

    $('.nav__link').on('click', function () {
        if ($(window).width() < 768) {
            $('[data-js="main-nav"]').slideUp(250);
            $('[data-js="menu-toggle"]').removeClass('is-active');
        }
    });

    /* =======================================================
       2. ПЛАВНЫЙ СКРОЛЛ ПО ANCHOR-ССЫЛКАМ
       ======================================================= */
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this).attr('href');
        if (target && target !== '#' && $(target).length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70
            }, 600);
        }
    });

    /* =======================================================
       3. МОДАЛЬНОЕ ОКНО
       ======================================================= */
    function openModal() {
        $('[data-js="modal"]').fadeIn(200).addClass('is-open');
        $('body').css('overflow', 'hidden');
    }

    function closeModal() {
        $('[data-js="modal"]').fadeOut(200).removeClass('is-open');
        $('body').css('overflow', '');
    }

    $('[data-js="modal-open"]').on('click', openModal);
    $('[data-js="modal-close"]').on('click', closeModal);

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('[data-js="modal"]').hasClass('is-open')) {
            closeModal();
        }
    });

    /* =======================================================
       4. ВАЛИДАЦИЯ + СИМУЛЯЦИЯ ОТПРАВКИ ($.ajax)
       ======================================================= */
    function showError($input, message) {
        $input.addClass('is-invalid');
        $('[data-error-for="' + $input.attr('id') + '"]').text(message);
    }

    function clearError($input) {
        $input.removeClass('is-invalid');
        $('[data-error-for="' + $input.attr('id') + '"]').text('');
    }

    function validateForm() {
        var isValid = true;
        var $name = $('#name');
        var $email = $('#email');
        var $message = $('#message');

        clearError($name);
        clearError($email);
        clearError($message);

        if ($.trim($name.val()).length < 2) {
            showError($name, 'Введите имя (минимум 2 символа)');
            isValid = false;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($.trim($email.val()))) {
            showError($email, 'Введите корректный email');
            isValid = false;
        }

        if ($.trim($message.val()).length < 5) {
            showError($message, 'Сообщение должно быть не короче 5 символов');
            isValid = false;
        }

        return isValid;
    }

    $('[data-js="contact-form"]').on('input', '.form__input', function () {
        clearError($(this));
    });

    $('[data-js="contact-form"]').on('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        var $btn = $('[data-js="submit-btn"]');
        var $status = $('[data-js="form-status"]');

        $btn.prop('disabled', true).text('Отправка...');
        $status.removeClass('is-success is-error').text('');

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            dataType: 'json',
            data: {
                name: $('#name').val(),
                email: $('#email').val(),
                message: $('#message').val()
            },
            success: function () {
                $status.addClass('is-success').text('Спасибо! Сообщение отправлено ✅');
                $('[data-js="contact-form"]')[0].reset();

                setTimeout(function () {
                    closeModal();
                    $status.removeClass('is-success').text('');
                }, 1800);
            },
            error: function () {
                $status.addClass('is-error').text('Ошибка отправки. Попробуйте позже.');
            },
            complete: function () {
                $btn.prop('disabled', false).text('Отправить');
            }
        });
    });

    /* =======================================================
       5. ГАЛЕРЕЯ ПОРТФОЛИО ИЗ JSON
       ======================================================= */
    function renderCard(item) {
        var $card = $('<article>').addClass('card');

        var imgClass = 'card__image';
        if (item.type === 'logo') {
            imgClass += ' card__image--contain';
        }

        var $img = $('<img>')
            .attr('src', item.image)
            .attr('alt', item.title)
            .addClass(imgClass);

        var $body = $('<div>').addClass('card__body');
        var $tag = $('<span>').addClass('card__tag').text(item.tag);
        var $title = $('<h3>').addClass('card__title').text(item.title);
        var $text = $('<p>').addClass('card__text').text(item.description);

        $body.append($tag, $title, $text);
        $card.append($img, $body);

        return $card;
    }

    $.getJSON('data/portfolio.json')
        .done(function (data) {
            var $figma = $('[data-js="portfolio-figma"]');
            var $apps = $('[data-js="portfolio-apps"]');

            $.each(data, function (i, item) {
                var $card = renderCard(item);
                if (item.category === 'app') {
                    $card.addClass('card--wide');
                    $apps.append($card);
                } else {
                    $figma.append($card);
                }
            });
        })
        .fail(function () {
            $('[data-js="portfolio-figma"]').html('<p class="card__text">Не удалось загрузить портфолио.</p>');
        });

    /* =======================================================
       6. КАРУСЕЛЬ НАВЫКОВ
       ======================================================= */
    var skills = [
        { name: 'HTML',       percent: 85 },
        { name: 'CSS / SCSS', percent: 80 },
        { name: 'Figma',      percent: 75 },
        { name: 'Git',        percent: 70 },
        { name: 'Linux',      percent: 65 },
        { name: 'MongoDB',    percent: 60 },
        { name: 'JavaScript', percent: 50 }
    ];

    var $track = $('[data-js="skill-track"]');
    var $dots = $('[data-js="skill-dots"]');

    $.each(skills, function (i, skill) {
        var $slide = $('<div>').addClass('carousel__slide');
        var $card = $('<div>').addClass('skill-card');

        var $head = $('<div>').addClass('skill-card__head');
        $head.append(
            $('<span>').addClass('skill-card__name').text(skill.name),
            $('<span>').addClass('skill-card__percent').text(skill.percent + '%')
        );

        var $bar = $('<div>').addClass('skill-card__bar');
        var $fill = $('<div>').addClass('skill-card__fill').css('width', skill.percent + '%');
        $bar.append($fill);

        $card.append($head, $bar);
        $slide.append($card);
        $track.append($slide);

        var $dot = $('<button>').attr('type', 'button')
            .addClass('carousel__dot')
            .attr('data-index', i);
        if (i === 0) $dot.addClass('is-active');
        $dots.append($dot);
    });

    var slideCount = skills.length;
    var slidesPerView = 3;
    var currentIndex = 0;
    var autoTimer = null;

    function getSlidesPerView() {
        if ($(window).width() < 768) return 1;
        if ($(window).width() < 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        slidesPerView = getSlidesPerView();
        var maxIndex = Math.max(0, slideCount - slidesPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        var slideWidth = 100 / slidesPerView;
        $track.css('transform', 'translateX(-' + (currentIndex * slideWidth) + '%)');

        $('.carousel__dot').removeClass('is-active');
        $('.carousel__dot').eq(currentIndex).addClass('is-active');
    }

    function nextSlide() {
        var maxIndex = Math.max(0, slideCount - slidesPerView);
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function prevSlide() {
        var maxIndex = Math.max(0, slideCount - slidesPerView);
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateCarousel();
    }

    $('[data-js="skill-next"]').on('click', function () {
        nextSlide();
        restartAuto();
    });

    $('[data-js="skill-prev"]').on('click', function () {
        prevSlide();
        restartAuto();
    });

    $dots.on('click', '.carousel__dot', function () {
        currentIndex = parseInt($(this).attr('data-index'), 10);
        updateCarousel();
        restartAuto();
    });

    function startAuto() {
        autoTimer = setInterval(nextSlide, 4000);
    }

    function restartAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    $(window).on('resize', updateCarousel);
    updateCarousel();
    startAuto();

    /* =======================================================
       7. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
       ======================================================= */
    var $sections = $('section[id]');
    var $navLinks = $('.nav__link');

    function highlightNav() {
        var scrollPos = $(window).scrollTop() + 120;
        var currentId = '';

        $sections.each(function () {
            if ($(this).offset().top <= scrollPos) {
                currentId = $(this).attr('id');
            }
        });

        $navLinks.removeClass('is-active');
        if (currentId) {
            $navLinks.filter('[href="#' + currentId + '"]').addClass('is-active');
        }
    }

    /* =======================================================
       8. АНИМАЦИЯ + КНОПКА ВВЕРХ
       ======================================================= */
    function onScroll() {
        highlightNav();

        $('.fade-in-section').each(function () {
            var $el = $(this);
            var elementTop = $el.offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();
            if (elementTop < windowBottom - 80) {
                $el.addClass('is-visible');
            }
        });

        if ($(window).scrollTop() > 400) {
            $('[data-js="to-top"]').addClass('is-visible');
        } else {
            $('[data-js="to-top"]').removeClass('is-visible');
        }
    }

    $(window).on('scroll', onScroll);

    $('[data-js="to-top"]').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    onScroll();

    /* =======================================================
       9. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ + localStorage
       ======================================================= */
    var THEME_KEY = 'portfolio-theme';

    function applyTheme(theme) {
        $('html').attr('data-theme', theme);
        $('[data-js="theme-icon"]').text(theme === 'dark' ? '☀️' : '🌙');
        localStorage.setItem(THEME_KEY, theme);
    }

    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY);
    }

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Инициализация темы
    var initialTheme = getSavedTheme() || getSystemTheme();
    applyTheme(initialTheme);

    $('[data-js="theme-toggle"]').on('click', function () {
        var current = $('html').attr('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
});