$(function () {
    'use strict';

    $('#menuToggle').on('click', function () {
        $(this).toggleClass('is-active');
        $('#mainNav').stop(true, true).slideToggle(250);
    });

    $('.nav__link').on('click', function () {
        if ($(window).width() <= 767) {
            $('#mainNav').slideUp(250);
            $('#menuToggle').removeClass('is-active');
        }
    });

    $('a[href^="#"]').on('click', function (e) {
        var target = $(this).attr('href');
        if (target && target !== '#' && $(target).length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70
            }, 600);
        }
    });

    function openModal() {
        $('#contactModal').fadeIn(200).addClass('is-open');
        $('body').css('overflow', 'hidden');
    }

    function closeModal() {
        $('#contactModal').fadeOut(200).removeClass('is-open');
        $('body').css('overflow', '');
    }

    $('#openContactModal, #openContactModalBottom').on('click', openModal);
    $('[data-close-modal]').on('click', closeModal);

    // Закрытие по Escape
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#contactModal').hasClass('is-open')) {
            closeModal();
        }
    });

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

    $('#contactForm').on('input', '.form__input', function () {
        clearError($(this));
    });


    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        var $btn = $('#submitBtn');
        var $status = $('#formStatus');

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
                $status
                    .addClass('is-success')
                    .text('Спасибо! Сообщение отправлено ✅');
                $('#contactForm')[0].reset();

                setTimeout(function () {
                    closeModal();
                    $status.removeClass('is-success').text('');
                }, 1800);
            },
            error: function () {
                $status
                    .addClass('is-error')
                    .text('Ошибка отправки. Попробуйте позже.');
            },
            complete: function () {
                $btn.prop('disabled', false).text('Отправить');
            }
        });
    });

    function renderCard(item) {
        var $card = $('<article>').addClass('portfolio-card');

        var imgClass = 'portfolio-card__img';
        if (item.type === 'logo') {
            imgClass += ' portfolio-card__img--logo';
        }

        var $img = $('<img>')
            .attr('src', item.image)
            .attr('alt', item.title)
            .addClass(imgClass);

        var $body = $('<div>').addClass('portfolio-card__body');

        var $tag = $('<span>').addClass('portfolio-card__tag').text(item.tag);
        var $title = $('<h3>').addClass('portfolio-card__title').text(item.title);
        var $text = $('<p>').addClass('portfolio-card__text').text(item.description);

        $body.append($tag, $title, $text);
        $card.append($img, $body);

        return $card;
    }

    $.getJSON('data/portfolio.json')
        .done(function (data) {
            var $figma = $('#portfolioFigma');
            var $apps = $('#portfolioApps');

            $.each(data, function (i, item) {
                var $card = renderCard(item);
                if (item.category === 'app') {
                    $card.addClass('portfolio-card--wide');
                    $apps.append($card);
                } else {
                    $figma.append($card);
                }
            });

            // Плавное появление карточек
            $figma.children().each(function (i) {
                $(this).delay(i * 120).fadeIn(400);
            });
        })
        .fail(function () {
            $('#portfolioFigma').html(
                '<p class="portfolio-card__text">Не удалось загрузить портфолио.</p>'
            );
        });

    var skills = [
        { name: 'HTML',       percent: 85 },
        { name: 'CSS',        percent: 80 },
        { name: 'Figma',      percent: 75 },
        { name: 'Git',        percent: 70 },
        { name: 'Linux',      percent: 65 },
        { name: 'MongoDB',    percent: 60 },
        { name: 'JavaScript', percent: 50 }
    ];

    var $track = $('#skillTrack');
    var $dots  = $('#skillDots');

    $.each(skills, function (i, skill) {
        var $slide = $('<div>').addClass('carousel__slide');
        var $card = $('<div>').addClass('skill-card');

        var $head = $('<div>').addClass('skill-card__head');
        $head.append(
            $('<span>').addClass('skill-card__name').text(skill.name),
            $('<span>').addClass('skill-card__percent').text(skill.percent + '%')
        );

        var $bar  = $('<div>').addClass('skill-card__bar');
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
        if ($(window).width() <= 767) return 1;
        if ($(window).width() <= 1023) return 2;
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

    $('#skillNext').on('click', function () {
        nextSlide();
        restartAuto();
    });

    $('#skillPrev').on('click', function () {
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

    var $sections = $('section[id]');
    var $navLinks = $('.nav__link');

    function highlightNav() {
        var scrollPos = $(window).scrollTop() + 120;
        var currentId = '';

        $sections.each(function () {
            var $section = $(this);
            if ($section.offset().top <= scrollPos) {
                currentId = $section.attr('id');
            }
        });

        $navLinks.removeClass('is-active');
        if (currentId) {
            $navLinks.filter('[href="#' + currentId + '"]').addClass('is-active');
        }
    }

    function onScroll() {
        highlightNav();

        // Fade-in секций
        $('.fade-in-section').each(function () {
            var $el = $(this);
            var elementTop = $el.offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();
            if (elementTop < windowBottom - 80) {
                $el.addClass('is-visible');
            }
        });

        // Кнопка «Вверх»
        if ($(window).scrollTop() > 400) {
            $('#toTop').addClass('is-visible');
        } else {
            $('#toTop').removeClass('is-visible');
        }
    }

    $(window).on('scroll', onScroll);

    $('#toTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    onScroll();
});