import $ from 'jquery';
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// お気に入りの総数を更新する関数
const updateFavoriteCount = () => {
  // 初期値を取得（初回のみ）
  if (!$('.js-fav-count').data('initial-count')) {
    const initialCount = parseInt($('.js-fav-count').text()) || 0;
    $('.js-fav-count').data('initial-count', initialCount);
  }

  const initialCount = $('.js-fav-count').data('initial-count');
  const currentFilledCount = $('.js-favorite.-filled').length;
  const totalCount = initialCount + currentFilledCount;

  $('.js-fav-count').text(totalCount);

  // 総数が0より多い場合は.is-showを付与
  if (totalCount > 0) {
    $('.js-fav-count').addClass('is-show');
  } else {
    $('.js-fav-count').removeClass('is-show');
  }
};

// 初期表示時にお気に入りの総数を設定
updateFavoriteCount();

// お気に入りボタンの処理
$('.js-favorite').on('click', function () {
  $(this).toggleClass('-filled');

  const $suggest = $(this).closest('.info').find('.js-suggest');
  if ($suggest.length) {
    $suggest.removeClass('is-show');
  }

  // お気に入りの総数を更新
  updateFavoriteCount();
});

// ギャラリーリストを閉じる処理
$('.js-close-gallery-list').on('click', function () {
  const $this = $(this);
  const $list = $this.prev('.list');

  $list.slideUp(300);
  $this.fadeOut(300);
});

// カード展開処理
$('.js-card-expand').on('click', function () {
  const $this = $(this);
  const $span = $this.find('span');

  // 初回クリック時に元のテキストを保存
  if (!$span.data('original-text')) {
    $span.data('original-text', $span.text());
  }

  $this.toggleClass('is-show');

  if ($this.hasClass('is-show')) {
    $span.text('閉じる');
  } else {
    $span.text($span.data('original-text'));
  }
});

// 物件ページ
if ($('.Property').length) {
  // チェックされたカードの総数を更新する関数
  const updateTotal = () => {
    const checkedCount = $('.Card_checkbox:checked').length;
    $('.js-total').text(checkedCount);
  };

  // 初期表示時に総数を設定
  updateTotal();

  // チェックボックスの変更を監視
  $('.Card_checkbox').on('change', updateTotal);

  // ソート変更時の処理
  $('.js-sort').on('change', function () {
    const selectedValue = $(this).val();

    // すべてのnoteから.is-showを削除
    $('.js-note').removeClass('is-show');

    // 選択された値に対応するnoteに.is-showを追加
    $(`.js-${selectedValue}`).addClass('is-show');
  });

  // 初期表示時に選択されているオプションのnoteを表示
  $('.js-sort').trigger('change');

  // オプションボタンのクリック処理
  $('.js-option-button').on('click', function () {
    $(this).toggleClass('selected');
  });
}

// 画像モーダル処理
$('.js-imageModal').on('click', function () {
  const $img = $(this).find('img');
  const imgSrc = $img.attr('src');
  const imgAlt = $img.attr('alt');

  // モーダルが存在しない場合は作成
  if (!$('#imageModal').length) {
    $('body').append(`
      <div id="imageModal" class="ImageModal">
        <button class="ImageModal_close js-modal-close"></button>
        <div class="ImageModal_content">
          <img src="" alt="">
        </div>
      </div>
    `);
  }

  // モーダルに画像を設定して表示
  $('#imageModal img').attr('src', imgSrc).attr('alt', imgAlt);
  $('#imageModal').addClass('is-show');
  $('body').css('overflow', 'hidden');

  // アニメーション用に少し遅延
  setTimeout(() => {
    $('#imageModal').addClass('is-visible');
  }, 10);
});

// モーダルを閉じる
$(document).on('click', '.js-modal-close, .ImageModal', function (e) {
  if ($(e.target).hasClass('ImageModal') || $(e.target).hasClass('js-modal-close')) {
    $('#imageModal').removeClass('is-visible');

    // アニメーション完了後に非表示
    setTimeout(() => {
      $('#imageModal').removeClass('is-show');
      $('body').css('overflow', '');
    }, 300);
  }
});

// ページトップへスクロール
$('.js-scrollToTop').on('click', function () {
  $('html, body').animate({ scrollTop: 0 }, 400);
});

// A2ページ
if ($('.A2').length) {
  // サムネイルスライダー
  const thumbnailSwiper = new Swiper('.thumbnail-swiper', {
    modules: [Thumbs],
    spaceBetween: 0,
    slidesPerView: 8,
    loop: true,
    watchSlidesProgress: true
  });

  // メインスライダー
  const mainSwiper = new Swiper('.main-swiper', {
    modules: [Navigation, Thumbs],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    thumbs: {
      swiper: thumbnailSwiper
    }
  });
}
