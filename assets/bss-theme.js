const changeTab = function(el) {
  document.querySelector(".toolbar-logo img").src = "https://cdn.shopify.com/s/files/1/0670/3484/1376/files/Frame_60667.png?v=1683691663"
  document.getElementById(el).classList.add("collection-link-selected")
}

if (window.location.pathname.normalize('NFC') == encodeURI("/collections/nam")) {
  changeTab("man-path")
  document.getElementById("man-path").parentElement.style.borderRight = "none"
} else if (window.location.pathname.normalize('NFC') == encodeURI("/collections/nữ")) {
  changeTab("women-path")
  document.getElementById("man-path").parentElement.style.borderRight = "none"
  document.getElementById("women-path").parentElement.style.borderRight = "none"
} else if (window.location.pathname.normalize('NFC') == encodeURI("/collections/trẻ-em")) {
  changeTab("kid-path")
  document.getElementById("women-path").parentElement.style.borderRight = "none"
}
$(document).ready(function() {
   if (window.innerWidth < 748) {
     $('.products-section .tabs').slick({
      dots: false,
      prevArrow: false,
      nextArrow: false,
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: false,
      variableWidth: true
    });
    $('.bss-slide-custom').slick({
      dots: true,
      rows: 2,
      arrow: true,
      prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
      nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
      slidesToShow: 2,
      slidesToScroll: 2,
      infinite: false
    });
     $('.bss-custom-blog').each(function() {
       $(this).slick({
        dots: true,
        prevArrow: false,
        nextArrow: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false
      });
     });
     $('.logo-list').each(function() {
       $(this).slick({
        dots: true,
        rows: 2,
        prevArrow: false,
        nextArrow: false,
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: false
      });
   });
  }
  $('.products-section  div.tabs').each(function(){
    var active, content, links = $(this).find('a');
    links.first().closest(".test").addClass('active_custom');
    active = links.first()
    content = $(active.attr('href'));
    links.not(':first').each(function () {
      $($(this).attr('href')).hide();
    });
    $(this).find('a').closest(".test").click(function(e){
      $(".test").removeClass('active_custom');
      content.hide();
      active = $(this).find("a");
      content = $(active.attr('href'));
      $(this).addClass('active_custom');
      content.show();
      return false;
    });
  });
  $('div.tabs.blogs').each(function(){
      var active, content, links = $(this).find('a');
      active = links.first();
      active.closest("div").addClass('active_custom');
      content = $(active.attr('href'));
      links.not(':first').each(function () {
        $($(this).attr('href')).css({"height": "0px", "overflow-y": "hidden"});
      });
      $(this).find('a').click(function(e){
        console.log(1,$(this), active, content )
        active.closest("div").removeClass('active_custom');
        content.css({"height": "0px", "overflow-y": "hidden"});
        active = $(this);
        content = $($(this).attr('href'));
        active.closest("div").addClass('active_custom');
        content.css({"height": "auto", "overflow-y": "auto"});
        return false;
      });
    });
 })

var productPageFunc = function () {
  function setSelectedValue(selectObj, valueToSet) {
      for (var i = 0; i < selectObj.options.length; i++) {
          if (selectObj.options[i].text == valueToSet) {
              selectObj.options[i].selected = true;
              return;
          }
      }
  }
  
  document.querySelectorAll(".bss-custom-product-form__input").forEach(item => {
    item.addEventListener("click", function(){
      let selectedValue = this.querySelector('input[type = radio]:checked').value
      let originalSelector = this.closest(".selector-wrapper").querySelector(".bss-mark")
      console.log(selectedValue, originalSelector)
      setSelectedValue(originalSelector, selectedValue);
    })
  })
   $(document).ready(function() {
     $('ul.tabs-discription').each(function(){
      var active, content, links = $(this).find('a');
      active = links.first().addClass('active_2');
      content = $(active.attr('href'));
      links.not(':first').each(function () {
        $($(this).attr('href')).hide();
      });
      $(this).find('a').click(function(e){
        active.removeClass('active_2');
        content.hide();
        active = $(this);
        content = $($(this).attr('href'));
        active.addClass('active_2');
        content.show();
        return false;
      });
    });
   })
  
}
  

productPageFunc()
document.querySelectorAll(".quick-buy").forEach(item => {
  item.addEventListener("click", function() {
    setTimeout(() => {
      productPageFunc()
      // if (document.querySelector(".product-container--quickbuy")) {
      //   productPageFunc()
      // }
    }, 5000)
  })
})
window.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(min-width: 750px)').matches) {
    return
  }

  const handleCollapse = (heading) => {
    if (heading.classList.contains('block-collapsed')) {
      heading.classList.remove('block-collapsed')
      heading.setAttribute('aria-expanded', 'true')
    } else {
      heading.classList.add('block-collapsed')
      heading.setAttribute('aria-expanded', 'false')
    }
  }

  document.querySelectorAll('.accordion .bss-custom-footer-title').forEach((heading, index) => {
    heading.classList.add('block-collapsed')
    heading.setAttribute('role', 'button')
    heading.setAttribute('aria-expanded', 'false')
    heading.setAttribute('tabindex', '1')

    heading.nextElementSibling.setAttribute('id', `footer-block-index-${index}`)
    heading.setAttribute('aria-controls', `footer-block-index-${index}`)

    heading.addEventListener('click', () => { handleCollapse(heading) })
    heading.addEventListener('keypress',  () => { handleCollapse(heading) })
  })
})
if (window.innerWidth < 748) {
  setTimeout(() => {
    let el = document.querySelector(".tabs.blogs");
    if (el) {
      document.querySelector(".bss-custom-blog-wrapper").appendChild(el);
      el.style.padding = "0px";
      document.querySelector(".tabs.blogs li");
    }
  }, 500)
}
document.querySelectorAll(".image-overlay").forEach((item) => {
  item.addEventListener("mouseover", function() {
    if (this.closest(".gallery__item")) {
      this.closest(".gallery__item").querySelector(".gallery__image").style.backgroundSize= "100% 100%"
    }
    if (this.closest(".section-image-with-text-overlay")) {
      this.closest(".section-image-with-text-overlay").querySelector(".rimage-background").style.backgroundSize= "100% 100%"
    }
  })
  item.addEventListener("mouseout", function() {
    if (this.closest(".gallery__item")) {
      this.closest(".gallery__item").querySelector(".gallery__image").style.backgroundSize= "110% 110%"
    }
    if (this.closest(".section-image-with-text-overlay")) {
      this.closest(".section-image-with-text-overlay").querySelector(".rimage-background").style.backgroundSize= "110% 110%"
    }
  })
})


