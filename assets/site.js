window.smartosc = window.smartosc || {};
window.asset_url = "//cdn.shopify.com/s/files/1/0670/3484/1376/t/3/assets/asset_urlfile.png?3207";

// Shopify linkOptionSelectors
// https://gist.github.com/carolineschnapp/1083007
//
Shopify.optionsMap = {};
Shopify.updateOptionsInSelector = function(selectorIndex, el) {

  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = el.find('.single-option-selector:eq(0)');
      break;
    case 1:
      var key = el.find('.single-option-selector:eq(0)')
        .val();
      var selector = el.find('.single-option-selector:eq(1)');
      break;
    case 2:
      var key = el.find('.single-option-selector:eq(0)')
        .val();
      key += ' / ' + el.find('.single-option-selector:eq(1)')
        .val();
      var selector = el.find('.single-option-selector:eq(2)');
  }

  var initialValue = selector.val();
  // selector.empty();
  var availableOptions = Shopify.optionsMap[key];
  if (availableOptions && availableOptions.length) {
    for (var i = 0; i < availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = $('<option class="dungpv"></option>')
        .val(option)
        .html(option);
      selector.append(newOption);
    }
    el.find(`.swatch[data-option-index='` + selectorIndex + `'] .swatch-element`)
      .each(function() {
        if ($.inArray($(this)
          .attr('data-value'), availableOptions) !== -1) {
          $(this)
            .addClass('available')
            .removeClass('soldout')
            .show()
            .find(':radio')
            .removeAttr('disabled', 'disabled')
            .removeAttr('checked');
        } else {
          $(this)
            .addClass('soldout')
            .removeClass('available')
            .find(':radio')
            .removeAttr('checked')
            .attr('disabled', 'disabled');
        }
      });
    if ($.inArray(initialValue, availableOptions) !== -1) {
      selector.val(initialValue);
    }
    selector.trigger('change');
  }
};
Shopify.linkOptionSelectors = function(product, el) {
  // Building our mapping object.
  Shopify.optionsMap = {};
  for (var i = 0; i < product.variants.length; i++) {
    var variant = product.variants[i];
    if (variant.available) {
      // Gathering values for the 1st drop-down.
      Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
      Shopify.optionsMap['root'].push(variant.option1);
      Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
      // Gathering values for the 2nd drop-down.
      if (product.options.length > 1) {
        var key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
      // Gathering values for the 3rd drop-down.
      if (product.options.length === 3) {
        var key = variant.option1 + ' / ' + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
    }
  }
  // Update options right away.
  Shopify.updateOptionsInSelector(0, el);
  if (product.options.length > 1) {
    Shopify.updateOptionsInSelector(1, el);
  }
  if (product.options.length === 3) {
    Shopify.updateOptionsInSelector(2, el);
  }
  // When there is an update in the first dropdown.
  el.find(".single-option-selector:eq(0)")
    .change(function() {
      Shopify.updateOptionsInSelector(1, el);
      if (product.options.length === 3) {
        Shopify.updateOptionsInSelector(2, el);
      }
      return true;
    });
  // When there is an update in the second dropdown.
  el.find(".single-option-selector:eq(1)")
    .change(function() {
      if (product.options.length === 3) {
        Shopify.updateOptionsInSelector(2, el);
      }
      return true;
    });

};

// Call back detail function
// When change variant
//
var selectCallbackDetail = function(variant, selector) {

  // Form element
  let elAddToCart = $('.product-form__controls-group--submit .product-form__cart'),
    elCartText = $('.product-form__controls-group--submit .product-form__cart .product-form__cart_text'),
    elBuyNow = $('.product-form__controls-group--submit .shopify-payment-button__button');

  // Price element
  let elPrice = $('.product-single .product__price > .price'),
    priceRegular = $('.product-single .price-item--regular'),
    priceCrocs = $('.product-single .price-item--crocs'),
    priceSale = $('.product-single .price-item--sale');



  if (variant) {
    if (variant.available) {
      elAddToCart.removeClass('sold_out')
        .removeAttr('disabled');
      elCartText.text(theme.strings.addToCart);
      elBuyNow.show();
    } else {
      elAddToCart.addClass('sold_out')
        .attr('disabled');
      elCartText.text(theme.strings.soldOut);
      elBuyNow.hide();
    }
    // Update price product
    let priceVariant = variant.price,
      comparePrice = variant.compare_at_price;

    if($('.price--on-crocs').length > 0){
  	  const dataCrocsprice=  $('.price--on-crocs').data('crocsprice');
      //console.log(dataCrocsprice);
      if(dataCrocsprice < 100){
         const minusCrocsPrice = 100 - parseFloat(dataCrocsprice);
         priceCrocs.html(theme.Currency.formatMoney((priceVariant *minusCrocsPrice)/100, theme.moneyFormat));
      }else{
        const minusCrocsPrice = parseFloat(dataCrocsprice) * 100;
        priceCrocs.html(theme.Currency.formatMoney((priceVariant - minusCrocsPrice), theme.moneyFormat));
      }
  	}


    if (comparePrice > priceVariant) {
      elPrice.addClass('price--on-sale');
      priceRegular.html(theme.Currency.formatMoney(comparePrice, theme.moneyFormat));
      priceSale.html(theme.Currency.formatMoney(priceVariant, theme.moneyFormat));
    } else {
      priceRegular.html(theme.Currency.formatMoney(priceVariant, theme.moneyFormat));
      elPrice.removeClass('price--on-sale');
    }

    // Update SKU and Barcode
    let elSKU = $('.product-single .product-single__sku'),
      elBarcode = $('.product-single .product-single__barcode');
    // Update SKU
    if (variant.sku != '') {
      elSKU.removeClass('hidden');
      elSKU.find('span')
        .html(variant.sku);
    } else {
      elSKU.addClass('hidden');
    }
    // Update Barcode
    if (variant.barcode != '') {
      elBarcode.removeClass('hidden');
      elBarcode.find('span')
        .html(variant.barcode);
    } else {
      elBarcode.addClass('hidden');
    }

    // Update image
    if (variant && variant.featured_media) {
      let newImage = variant.featured_media.preview_image.src,
        elThumb = $('.product-single__thumbnails img');
      let newImageFomart = theme.Images.getSizedImageUrl(newImage, '110x110@2x');
      if (elThumb.length > 1) {
        elThumb.each(function() {
          let urlImg = $(this)
            .attr('src');
          if (newImageFomart === urlImg) {
            $(this)
              .parent()
              .trigger('click');
          }
        });
      }
    }

    // update input quantity
    $('#product-selectors')
      .change();
  } else {
    elAddToCart.addClass('sold_out')
      .attr('disabled');
    elCartText.text(theme.strings.unavailable);
    elBuyNow.hide();
  }

  if ($('.product-form__swatch').length > 0) {
    var form = $('#' + selector.domIdPrefix)
      .closest('form');
    for (var i = 0, length = variant.options.length; i < length; i++) {
      var radioButton = form.find(`.swatch[data-option-index="` + i + `"] :radio[value='` + variant.options[i] + `']`);
      if (radioButton.length) {
        radioButton.get(0).checked = true;
      }
    }
  }
};

// convertToSlug
smartosc.convertToSlug = function(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Validate input
smartosc.validateInputNumber = function() {
  $(".quantity__custom--input")
    .keyup(function(e) {
      let self = $(this);
      if (this.value != '') {
        if (/\D/g.test(this.value)) {
          this.value = this.value.replace(/\D/g, '');
        }
        smartosc.checkQtyChange(self);
      }
    });
  $(document)
    .click(function(event) {
      let $target = $(event.target);
      if (!$target.hasClass('quantity__custom--input')) {
        $(".quantity__custom--input")
          .each(function() {
            let val = $(this)
              .val();
            if (val == '') {
              $(this)
                .val(1);
            }
          });
      }
    });
}
smartosc.checkQtyChange = function(self) {
  let valInput = self.val();
  let maxQt = self.data('quantity');
  if (valInput == '' || valInput == 0) {
    self.val(1);
  }
  if (maxQt) {

    if (valInput > maxQt) {
      self.val(maxQt);
      let ms = 'This variant has only ' + maxQt + ' item in store';
      alert(ms);
      return false;
    }
  }
}
// Init function
//
smartosc.init = function() {
  // Trick for quick of Fillter App Boost
  document.addEventListener('click', function(e) {
    if(e.target.closest('.quickview_button')) {
      smartosc.quickview();
    }
  });

  if ($('.product-single').length > 0) {
    smartosc.prdDetail();
  }
  if ($('.product-single .product-form .product-form__controls-group').length > 0) {
    this.productSelector();
  }
  if ($('.product-form__swatch').length > 0) {
    this.swatchChange();
  }
  smartosc.addToCart();
  if (theme.settings.miniCartType == 'canvas') {
    smartosc.canvasCart();
  }
  smartosc.removeItemCart();
  smartosc.hidenPopupMiniCart();

  if ($('.products__color-variant').length > 0) {
    smartosc.colorSwatchChange();
  }
  smartosc.filterProduct();

  if ($('.product_sl').length > 0) {
    smartosc.ssProductSl();
  }

  if ($('.smartSlider').length > 0) {
    smartosc.collectionsSlider();
  }


  if ($('.logo_sl').length > 0) {
    smartosc.ssLogoSl();
  }

  if ($('.sidebar_product_slide').length > 0) {
    smartosc.sbProductSlide();
  }
  smartosc.menuHeader();

  smartosc.sbToggleMobile();

  smartosc.tabsCustom();

  smartosc.validateInputNumber();

  smartosc.termConditionsCheckout();

  smartosc.instagram();

  smartosc.addToCartMulti();
  smartosc.scrollToTop();
  smartosc.reinitView();
  smartosc.accordion();

  smartosc.pageCustomServices();
  smartosc.keepMeLogged();
};

// OptionSelectors
//
smartosc.productSelector = function() {
  let productJSON;
  let productSelect = 'product-selectors';
  if ($('.ss-featured-product').length > 0) {
    let sectionId = $('.ss-featured-product')
      .find('.featured_product')
      .data('section-id');
    let productJson = $('#ProductJson-' + sectionId);
    productJSON = JSON.parse($(productJson)
      .html());
    productSelect = 'ProductSelect-' + sectionId;
  } else {
    productJSON = JSON.parse($('#ProductJson-product-template')
      .html());
  }

  new Shopify.OptionSelectors(productSelect, {
    product: productJSON,
    onVariantSelected: selectCallbackDetail,
    enableHistoryState: true
  });
  let elDetail = $('.product-single');
  if (theme.settings.variantType == 'swatch') {
    Shopify.linkOptionSelectors(productJSON, elDetail); // support swatch color
  }
}


// Trim string
smartosc.trimString = function(str, limit, end) {
  let strRemoveHtml = str.replace(/(<([^>]+)>)/ig, ""),
    strArr = strRemoveHtml.split(" "),
    countArr = strArr.length,
    newString = '';
  if (countArr > limit) {
    newString = strArr.splice(0, limit)
      .join(" ") + end;
  } else {
    newString = str;
  }
  return newString;
}

// Color swatch change to update image
smartosc.colorSwatchChange = function() {
  $('body')
    .on('click', '.products__color-variant .products__color-item', function() {
      let el = $(this)
          .parents('.product-card'),
        newImage = $(this)
          .data('img');
      if (newImage != '') {
        let mainImage = el.find('.grid-view-item__image.img-primary');
        el.find('.products__color-variant .active')
          .removeClass('active');
        $(this)
          .addClass('active');
        mainImage.attr('srcset', newImage);
      }
    });
}

// Update quantity custom
//
smartosc.quantityAction = function() {
  // handle action update quantity
  $(document)
    .on('click', '.product-quantity__icon-minus', function(e) {
      let elInput = $(this)
        .parent()
        .find('input');
      let oldVal = elInput.val();
      if (oldVal > 1) {
        newVal = oldVal - 1;
        elInput.val(newVal);
      }
    });
  $(document)
    .on('click', '.product-quantity__icon-plus', function(e) {
      let elInput = $(this)
        .parent()
        .find('input');
      let oldVal = parseInt(elInput.val());
      let maxQt = elInput.data('quantity');
      console.log(maxQt, elInput);

      if (maxQt) {
        if (oldVal < maxQt) {
          newVal = oldVal + 1;
          elInput.val(newVal);
        } else {
          let ms = 'This variant has only ' + maxQt + ' item in store';
          alert(ms);
          return false;
        }
      } else {
        newVal = oldVal + 1;
        elInput.val(newVal);
      }
    });
}

// Update quantity when change variant
//
smartosc.triggerChangeSelectVariant = function() {
  $('#product-selectors')
    .on("change", function() {
      let maxQuantity = $(this)
        .children("option:selected")
        .data('quantity');

      // Returns the string continue if the "Allow users to purchase this item, even if it is no longer in stock." checkbox is checked in the variant options in the Admin. Returns deny if it is unchecked.
      let inventory_policy = $(this)
        .children("option:selected")
        .data('continue');
      if (inventory_policy == 'continue') {
        $('#Quantity-product-template')
          .data('quantity', null);
      } else {
        if (maxQuantity) {
          $('#Quantity-product-template')
            .data('quantity', maxQuantity);
          let valInputQt = $('#Quantity-product-template')
            .val();
          if (valInputQt > maxQuantity) {
            $('#Quantity-product-template')
              .val(maxQuantity);
          }
        } else {
          $('#Quantity-product-template')
            .data('quantity', null);
        }
      }

    });
},
// Quickview
//
  smartosc.quickview = function() {
    $(document)
      .on('click', '.quickview_button', function(e) {
        e.preventDefault();
        $('.smart-loading')
          .show();
        let productHandle = $(this)
          .data('product_handle');
        let dataModelView = $(this)
          .data('modelview');
        smartosc.doAjaxQuickview(productHandle, dataModelView);
        // smartosc.addToCart();
      });

    $(document)
      .on('click', '.quickview-popup .close, .quickview-popup.smart_modal', function(e) {
        e.preventDefault();
        if (typeof (e.target.className) === 'string') {
          if (e.target.className.includes('smart_modal') || e.target.className.includes('close')) {
            $('.quickview-popup')
              .hide()
              .html('');
            $('body')
              .removeClass('overflow-hidden');
            $('.overlay')
              .addClass('hide');
          }
        }
      });
  }

// Do ajax quickview
//
smartosc.doAjaxQuickview = function(productHandle, dataModelView) {
  let urlAjax = '/products/' + productHandle + '.js';
  if ($('#lang-list .disclosure-list__item.disclosure-list__item--current').length > 0) {
    let dataLocal = $('#lang-list .disclosure-list__item.disclosure-list__item--current')
      .data('locale_url');
    if (dataLocal.length > 1) {
      urlAjax = dataLocal + urlAjax;
    }
  }

  jQuery.getJSON(urlAjax, function(product) {
    smartosc.renderQuickview(product, dataModelView);

  });


}

// Calback quickview
var selectCallbackQuickview = function(variant, selector) {
  // console.log(variant);
  let qv = $('.quickview-popup'),
    elAddToCart = qv.find('.product-form__cart'),
    qvButton = $('.quickview_button[data-quickview-id=' + selector.product.id + ']'),
    inventory = qvButton.data('variant-inventory');
  if (inventory) {
    for (i = 0; i < inventory.length; i++) {
      let obj = inventory[i];
      if (variant.id == obj.id) {
        if (obj.management == 'shopify') {
          qlt = obj.inventory_quantity;
        } else {
          qlt = null;
        }

      }
    }
    // Update qty
    qv.find('.quantity__custom--input')
      .attr('data-quantity', qlt);
    qv.find('.quantity__custom--input')
      .data('quantity', qlt);
    let oldQty = qv.find('#Quantity-quickview')
      .val();
    if (qlt) {
      if (oldQty > qlt) {
        qv.find('.quantity__custom--input')
          .val(qlt);
      }
    }
  }

  if (variant) {
    if (variant.sku != '') {
      qv.find('.quickview__content-sku')
        .removeClass('hide');
      qv.find('.quickview__content-sku .value')
        .html(variant.sku);
    }
    if (variant.available) {
      elAddToCart.removeClass('sold_out')
        .removeAttr('disabled');
      elAddToCart.text(theme.strings.addToCart);
      qv.find('.quickview__content-availability .in_stock')
        .removeClass('hide');
      qv.find('.quickview__content-availability .sold_out')
        .addClass('hide');
    } else {
      elAddToCart.addClass('sold_out')
        .attr('disabled');
      elAddToCart.text(theme.strings.soldOut);
      qv.find('.quickview__content-availability .sold_out')
        .removeClass('hide');
      qv.find('.quickview__content-availability .in_stock')
        .addClass('hide');
    }
    // Update price
    let elPrice = qv.find('.quickview__price');
    let price = variant.price,
      comparePrice = variant.compare_at_price;
    if (price < comparePrice) {
      elPrice.addClass('price--on-sale');
      elPrice.find('.quickview__price-regular span')
        .html(theme.Currency.formatMoney(comparePrice, theme.moneyFormat));
      elPrice.find('.quickview__price-sale span')
        .html(theme.Currency.formatMoney(price, theme.moneyFormat));
    } else {
      elPrice.removeClass('price--on-sale');
      elPrice.find('.quickview__price-regular span')
        .html(theme.Currency.formatMoney(price, theme.moneyFormat));
      elPrice.find('.quickview__price-sale span')
        .html(theme.Currency.formatMoney(price, theme.moneyFormat));
    }
    // Update image
    if (variant && variant.featured_media) {
      let newImage = variant.featured_media.preview_image.src,
        elThumb = $('.quickview__thumbs img');
      let newImageFomart = theme.Images.getSizedImageUrl(newImage, 'x100');
      if (elThumb.length > 1) {
        elThumb.each(function() {
          let urlImg = $(this)
            .attr('src');
          if (newImageFomart === urlImg) {
            $(this)
              .parent()
              .trigger('click');
          }
        });
      }
    }
  } else {
    elAddToCart.addClass('sold_out')
      .attr('disabled');
    elAddToCart.text(theme.strings.unavailable);
  }
  if (theme.settings.variantType == 'swatch') {
    var form = $('#' + selector.domIdPrefix)
      .closest('form');
    for (var i = 0, length = variant.options.length; i < length; i++) {
      var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] + '"]');
      if (radioButton.length) {
        radioButton.get(0).checked = true;
      }
    }
  }
}

// render quickview
smartosc.renderQuickview = function(product, dataModelView) {
  $('.smart-loading').hide();
  $('.overlay').removeClass('hide');
  $('body').addClass('overflow-hidden');
  $('.quickview-popup').show();
  let htmlQV = $('.quick-view-template').html();
  let qv = $('.quickview-popup');
  qv.html(htmlQV); // clone html quickview
  smartosc.quantityAction();
  // render content
  let elTitle = $('.quickview__title a.quickview__title--link'),
    elPrice = $('.quickview__price'),
    elWishlist = $('.quickview__wishlist'),
          elVendor = $('.quickview__vendor');
  let newDesc = '';
  let elQuickviewFull = $('.bc-quickview-view-full');

  // render title
  elTitle.html(product.title);
  elTitle.attr('href', product.url);
  elTitle.click(function() {
    window.location.href = product.url;
  })
  elQuickviewFull.click(function() {
    window.location.href = product.url;
  })
  elVendor.html( product.vendor);

  elQuickviewFull.attr('href', product.url);
  qv.find('.shopify-product-reviews-badge')
    .data('id', product.id);
  qv.find('.shopify-product-reviews-badge')
    .attr('data-id', product.id);
  if (window.SPR) {
    SPR.initDomEls();
    SPR.loadBadges();
  }

  // render tags
  // Check a product is on crocs
  let onCrocs = false;
  let crocsAtPrice = '';
  let tags = product.tags;
  if (tags.length > 0) {
    let elTags = '';
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] == 'new') {
        elTags += '<span class="tags-name new">' + theme.strings.tag_new + '</span>';
      }

      if (tags[i] == 'hot') {
        elTags += '<span class="tags-name hot">' + theme.strings.tag_hot + '</span>';
      }

      if(tags[i].includes('OFF')){
          	onCrocs = true;
            crocsAtPrice =  tags[i].replace(/[%*.|a-zA-Z ]+/g, "");
      }
    }

    if (elTags != '') {
      qv.find('.quickview__tags')
        .html(elTags);
    }

  }


  // render desc
  elWishlist.attr('data-product-id', product.id);

  // render price
  let price = product.price,
    comparePrice = product.compare_at_price,
    onCrocsClass = 'price--on-crocs';

  if(onCrocs == true){
  	elPrice.addClass(onCrocsClass);
    const dataCrocsprice = crocsAtPrice;
    let crocsPrice = 0;
    //console.log('dataCrocsprice',dataCrocsprice);
    if(dataCrocsprice < 100){
      const minusCrocsPrice = 100 - parseFloat(dataCrocsprice);
      crocsPrice =  (price *minusCrocsPrice)/100;
    }else{
      const minusCrocsPrice = parseFloat(dataCrocsprice)*100 ;
      crocsPrice = price - minusCrocsPrice;
    }

      elPrice.find('.quickview__price-crocs span')
      .html(theme.Currency.formatMoney(crocsPrice, theme.moneyFormat));
  }else{
  	  elPrice.removeClass(onCrocsClass);
      elPrice.find('.quickview__price-crocs span').html('');
  }

  if (price < comparePrice) {
    elPrice.addClass('price--on-sale');
    elPrice.find('.quickview__price-regular span')
      .html(theme.Currency.formatMoney(comparePrice, theme.moneyFormat));
    elPrice.find('.quickview__price-sale span')
      .html(theme.Currency.formatMoney(price, theme.moneyFormat));
    // let tags_discount = '<span class="tags-name sale_percen">' + Math.round((1 - (product.price / product.compare_at_price)) * 100) + '%</span>';
    // qv.find('.quickview__tags').append(tags_discount);
  } else {
    elPrice.removeClass('price--on-sale');
    elPrice.find('.quickview__price-sale span').html('');
    elPrice.find('.quickview__price-regular span').html(theme.Currency.formatMoney(price, theme.moneyFormat));
  }

  // render slide
  if (product.media) {
    smartosc.renderQVSlide(product, qv, dataModelView);
  }

  //render wishlist
  // if(!window._swat){
  //   window._swat.fetch(function(products){
  //      wishlist = $('.quickview__content .quickview__wishlist');
  //      const productId = product.id ;
  //      const items = products.filter(function(x){
  //        return x.et == window._swat.EventTypes.addToWishList && x.empi == productId;
  //      });

  //      if(items.length > 0){
  //        $(wishlist).addClass("swym-added").attr("disabled", true);
  //      }else{
  //        $(wishlist).removeClass("swym-added").attr("disabled", false);
  //        $(wishlist).on("click", function(e){
  //          e.preventDefault();
  //          const productData = JSON.parse(JSON.stringify(SwymViewProducts[productId]));
  //          productData.et = SwymTracker.EventTypes.addToWishList;
  //          _swat.addToWishList(productData, function(){console.log("Added to wishlist");});
  //          $(wishlist).addClass("swym-added").attr("disabled", true);
  //        })
  //      }

  //    })
  // }


  // render form
  qv.find('.quickview__form .quickview__form-selector')
    .attr('id', 'quickview__selector-' + product.id);
  if (!product.available) {
    qv.find('.btn.product-form__cart')
      .text(theme.strings.unavailable)
      .addClass('disabled')
      .attr("disabled", "disabled");
  } else {
    // render variant
    if (product.variants[0].title != 'Default Title') {
      if (theme.settings.variantType == 'swatch') {
        smartosc.renderQVVariantSwatch(product, qv);
      } else {
        smartosc.renderQVVariantDefault(product, qv);
      }
    } else {

      qv.find('.quickview__form-selector')
        .remove();
      let elInputName = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
      qv.find('.quickview__group-selector')
        .append(elInputName);
    }
  }
  smartosc.validateInputNumber();
  smartosc.triggerChangeSelectVariant();

}

// render quickview slide
smartosc.renderQVSlide = function(product, el, dataModelView) {
  // console.log(dataModelView);
  let listMedia = product.media;
  if(listMedia != undefined){
    let countMedia = listMedia.length;
    let imgThumbs = '';
    let imgGallery = '';
    let elListImg = '';
    let id = '';

    /*let featureImg = theme.Images.getSizedImageUrl(product.featured_image, 'x450');
	el.find('.quickview__feature-image').html('<img src="' + featureImg + '" alt="" />');*/
    if (countMedia >= 1) {
      featureImg = '';
      let classActivve = '';
      for (let i = 0; i < countMedia; i++) {
        let itemMedia = listMedia[i];
        id = itemMedia.id;
        imgThumbs = theme.Images.getSizedImageUrl(itemMedia.preview_image.src, 'x450');
        imgGallery = theme.Images.getSizedImageUrl(itemMedia.preview_image.src, 'x450');

        if (i == 0) {
          classActivve = ' active';
        } else {
          classActivve = '';
        }
        switch (itemMedia.media_type) {
          case "image":
            elListImg += '<div class="swiper-slide" data-id="' + id + '"><img src="' + imgThumbs + '" alt="" /></div>';
            featureImg += '<div class="feature_item' + classActivve + '" data-id="' + id + '">'
                    + '<img src="' + imgGallery + '" alt="" /></div>';
            break;
          case "external_video":
            elListImg += '<div class="swiper-slide" data-id="' + id + '">'
                    + '<img src="' + imgThumbs + '" alt="" />'
                    + '</div>';
            featureImg += '<div class="feature_item' + classActivve + '" data-id="' + id + '">'
                    + '<div class="responsive-video"><iframe frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen" src="https://www.youtube.com/embed/' + itemMedia.external_id + '?controls=1&amp;enablejsapi=1&amp;modestbranding=1&amp;playsinline=1&amp;rel=0"></iframe></div>'
                    + '</div>';
            break;
          case "model":
            elListImg += '<div class="swiper-slide" data-id="' + id + '">'
                    + '<img src="' + imgThumbs + '" alt="" />'
                    + '</div>';
            featureImg += '<div class="feature_item' + classActivve + '" data-id="' + id + '">'
                    + '<div class="responsive-model-view" data-shopify-xr><model-viewer data-model-id="' + id + '" src="' + itemMedia.sources[0].url + '" ios-src="' + itemMedia.sources[1].url + '" poster="' + itemMedia.preview_image.src + '" camera-controls="true"></model-viewer></div>'
                    + '</div>';
            break;
          case "video":
            let elSource = '';
            let sources = itemMedia.sources;
            for (let i = 0; i < 3; i++) {
              if (sources[i].format == 'mp4' && sources[i].height == 720) {
                elSource += '<source src="' + sources[i].url + '" type="video/mp4">';
              } else if (sources[i].format == 'mp4' && sources[i].height == 480) {
                elSource += '<source src="' + sources[i].url + '" type="video/mp4">';
              } else if (sources[i].format == 'm3u8') {
                elSource += '<source src="' + sources[i].url + '" type="application/x-mpegURL">';
              }
            }
            elListImg += '<div class="swiper-slide" data-id="' + id + '">'
                    + '<img src="' + imgThumbs + '" alt="" />'
                    + '</div>';
            featureImg += '<div class="feature_item' + classActivve + '" data-id="' + id + '">'
                    + '<div class="responsive-video">'
                    + '<video playsinline="true" poster="' + imgGallery + '" controls>'
                    + elSource
                    + '<img src="' + imgGallery + '">'
                    + '</video>'
                    + '</div>';
            +'</div>';
            break;
        }
      }
      /*if (featureImg != '') {
		el.find('.quickview__feature-image').html(featureImg);
		if (dataModelView) {
		  function setupShopifyXr() {
			if (!window.ShopifyXR) {
			  document.addEventListener('shopify_xr_initialized', function() {
				setupShopifyXr();
			  });
			} else {
			  let models = dataModelView;
			  window.ShopifyXR.addModels(models);
			  window.ShopifyXR.setupXRElements();
			}
		  }

		  window.Shopify.loadFeatures([
			{
			  name: 'shopify-xr',
			  version: '1.0',
			  onLoad: setupShopifyXr
			}
		  ]);
		}
	  }*/
      el.find('.quickview__thumbs .swiper-wrapper')
              .html(elListImg);
      let directionSL = 'horizontal';

      let galleryThumbsQV = new Swiper('.quickview-popup .quickview__thumbs.swiper-container', {
        spaceBetween: 0,
        slidesPerView: 1,
        // autoHeight: true,
        direction: directionSL,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.quickview__thumbs .swiper-button-next',
          prevEl: '.quickview__thumbs .swiper-button-prev',
        }
      });
      window.qvSlide = galleryThumbsQV;
      $('.quickview__thumbs .swiper-slide')
              .click(function() {
                let id = $(this)
                        .data('id');
                let oldId = $('.quickview__feature-image .feature_item.active')
                        .data('id');
                if (id != oldId) {
                  $('.quickview__feature-image .feature_item.active')
                          .removeClass('active');
                  $(".quickview__feature-image")
                          .find(".feature_item[data-id='" + id + "']")
                          .addClass('active');
                }

                // let srcNew = $(this).data('gallery'),
                //     srcOld = $('.quickview__feature-image img').attr('src');
                // if(srcNew != srcOld) {
                //     $('.quickview__feature-image img').attr('src', srcNew);
                //     el.find('.quickview__feature-image').addClass('loading');
                //     $('.quickview__feature-image img').on('load', function(){
                //         el.find('.quickview__feature-image').removeClass('loading');
                //         $(this).unbind('load');
                //     });
                // }
              });
      if (window.innerWidth < 1025) {
        window.qvSlide.changeDirection('horizontal');
      }
      // window.ShopifyXR.launchXR({
      //     model3dId: 1,
      //     title: 'title',
      // });
    }

  }else{

    el.find('.quickview__thumbs-wrapper').addClass('quickview__thumbs__nophoto');
    el.find('.swiper-button-next').hide();
    el.find('.swiper-button-prev').hide();
  }
}

// Render quickview vaiant select default
//
smartosc.renderQVVariantDefault = function(product, el) {
  let opt = product.options;
  let variantSize = product.variants.length;
  let idSelector = 'quickview__selector-' + product.id;

  if (variantSize > 1) {
    for (let i = 0; i < variantSize; i++) {
      let variant = product.variants[i];
      let option = '<option value="' + variant.id + '">' + variant.title + '</option>';
      el.find('.quickview__form select.quickview__form-selector')
        .append(option);
    }
    new Shopify.OptionSelectors(idSelector, {
      product: product,
      onVariantSelected: selectCallbackQuickview
    });
    if (opt.length > 0) {
      for (let i = 0; i < opt.length; i++) {
        el.find('.selector-wrapper:eq(' + i + ') label')
          .text(opt[i].name);
      }
    }
  }

}

smartosc.renderQVVariantSwatch = function(product, el) {
  smartosc.renderQVVariantDefault(product, el);
  let opt = product.options,
    variants = product.variants,
    elOPt = '';

  for (let i = 0; i < opt.length; i++) {
    elOPt += '<div class="swatch clearfix" data-option-index="' + i + '">';
    elOPt += '<div class="header">' + opt[i].name + '<span>*</span></div>';
    elOPt += '<div class="swatch_list">';
    let is_color = false;
    if (/Color|Colour/i.test(opt[i].name)) {
      is_color = true;
    }
    let optionValues = new Array();
    for (let j = 0; j < variants.length; j++) {
      let variant = variants[j];
      let variantImg = variant.featured_image.src;
      let value = variant.options[i];
      let valueHandle = smartosc.convertToSlug(value);
      let assetUrl = window.asset_url.replace('asset_urlfile', valueHandle);
      let soldoutImg = window.asset_url.replace('asset_urlfile', 'soldout');
      let forText = 'swatch-' + i + '-' + valueHandle;
      if (optionValues.indexOf(value) < 0) {
        //not yet inserted
        elOPt += '<div data-value="' + value + '" class="swatch-element ' + (is_color ? "color " : "") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';

        if (is_color) {
          elOPt += '<div class="tooltip">' + value + '</div>';
        }
        elOPt += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : ' disabled') + ' />';

        if (is_color) {
          elOPt += '<label for="' + forText + '" style="background-color: ' + valueHandle + '; background-image: url(' + variantImg + ');background-size: cover;"><img class="soldout-img" src="' + soldoutImg + '" /></label>';
        } else {
          elOPt += '<label for="' + forText + '">' + value + '<img class="soldout-img" src="' + soldoutImg + '" /></label>';
        }
        elOPt += '</div>';
        if (variant.available) {
          $('.quickview__content .swatch[data-option-index="' + i + '"] .' + valueHandle)
            .removeClass('soldout')
            .addClass('available')
            .find(':radio')
            .removeAttr('disabled');
        }
        optionValues.push(value);
      }
    }
    elOPt += '</div>'; // End swatch_list
    elOPt += '</div>';
  }
  el.find('.quickview__content .quickview__swatch').append(elOPt);
  $('.swatch .swatch-element label')
    .click(function(e) {
      e.preventDefault();
      $(this)
        .parent()
        .find('input')
        .trigger('click');
    })
  el.find('.swatch :radio')
    .change(function() {
      var optionIndex = $(this)
        .closest('.swatch')
        .attr('data-option-index');
      var optionValue = $(this)
        .val();
      $(this)
        .closest('form')
        .find('.single-option-selector')
        .eq(optionIndex)
        .val(optionValue)
        .trigger('change');
    });
  if (product.available) {
    Shopify.optionsMap = {};
    Shopify.linkOptionSelectors(product, el);
  }
}

// Product detail
//
smartosc.prdDetail = function() {
  var productDetail = {
    init: function() {
      smartosc.triggerChangeSelectVariant();
      if ($('.product-single .product-single__thumbnails.swiper-container').length > 0) {
        this.renderSlider();
      }
      if ($('.product-quantity__controls').length > 0) {
        smartosc.quantityAction();
      }
      if ($('.product-single .product__countdown').length > 0) {
        let endDate = $('.product-single .product__countdown')
          .data('countdown');
        this.countdown(endDate);
      }
      this.infoModal();
      if ($('.product-page__contact-ms').length > 0) {
        this.checkContactForm();
      }
    },
    renderSlider: function() {
      let getDirection = $('.product-single .thumbnails-desktop.swiper-container')
        .data('slider-direction');
      if (getDirection === '') {
        getDirection = 'horizontal'
      }

      let galleryThumbs = new Swiper('.product-single .thumbnails-desktop.swiper-container', {
        spaceBetween: 0,
        slidesPerView: 4,
        direction: getDirection,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          // when window width is >= 320px
          320: {
            slidesPerView: 3,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 3,
          },
          767: {
            slidesPerView: 4,
          }
        }
      });

      // On mobile
      let getDirectionMb = $('.product-single .thumbnails-mobile.swiper-container')
        .data('slider-direction');
      if (getDirectionMb === '') {
        getDirectionMb = 'horizontal'
      }

      let galleryThumbsMb = new Swiper('.product-single .thumbnails-mobile.swiper-container', {
        spaceBetween: 0,
        slidesPerView: 4,
        direction: getDirectionMb,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          // when window width is >= 320px
          320: {
            slidesPerView: 3,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 3,
          },
          767: {
            slidesPerView: 4,
          }
        }
      });
    },
    countdown: function(date) {
      if (date && Date.parse(date)) {
        let formatDate = new Date(date).getTime();
        let nowDate = new Date().getTime();
        if (formatDate - nowDate > 0) {
          $('.product-single .product__countdown')
            .countdown(date, function(event) {
              // $(this).html(event.strftime('%Dd %H:%M:%S'));
              $(this)
                .html(event.strftime('<div class="count_item"><span class="days">%D</span><span>' + theme.strings.coudown_day + '</span></div>'
                  + '<div class="count_item"><span class="hours">%H</span><span>' + theme.strings.coudown_hrs + '</span></div>'
                  + '<div class="count_item"><span class="mins">%M</span><span>' + theme.strings.coudown_min + '</span></div>'
                  + '<div class="count_item"><span class="sec">%S</span><span>' + theme.strings.coudown_sec + '</span></div>'));
            });
        }
      }
    },
    infoModal: function() {
      $(document)
        .on('click', '.product-page-info__buttons a', function(e) {
          e.preventDefault();
          let idModal = '#' + $(this)
            .data('id');
          if ($(idModal).length > 0) {
            $(idModal)
              .show();
            $('.product-single.overlay')
              .removeClass('hide');
            $('body')
              .addClass('overflow-hidden');
          }
        });
      $(document)
        .on('click', '.smart_modal .close, .product-single__info-modal', function(e) {
          if (e.target.className.includes('smart_modal') || e.target.className.includes('close')) {
            $('.product-single__info-modal')
              .hide();
            $('body')
              .removeClass('overflow-hidden');
            $('.product-single.overlay')
              .addClass('hide');
          }
        });
    },
    checkContactForm: function() {
      if ($('.content__contact .form-message').length > 0) {
        $('.content__contact .form-message')
          .appendTo('.product-page__contact-ms');
        let url = window.location.href;
        if (url.includes('variant=')) {
          url = url.replace('contact_posted=true&', '');
        } else {
          url = url.replace('?contact_posted=true', '');
        }
        history.pushState('', document.title, url)
      }
    }
  }
  productDetail.init();
}

// Variant swatch change
//
smartosc.swatchChange = function() {
  $('.swatch .swatch-element label')
    .click(function(e) {
      e.preventDefault();
      $(this)
        .parent()
        .find('input')
        .trigger('click');
    })
  $('.swatch :radio')
    .change(function() {
      var optionIndex = $(this)
        .closest('.swatch')
        .attr('data-option-index');
      var optionValue = $(this)
        .val();
      $(this)
        .closest('form')
        .find('.single-option-selector')
        .eq(optionIndex)
        .val(optionValue)
        .trigger('change');
    });
}

// Action add to cart
//
smartosc.addToCart = function() {
  $(document)
    .on('click', '.product-form__cart', function(e) {
      e.preventDefault();

      let productItem = $(this)
        .parents('.product-item');
      let variant_id = productItem.find('select[name=id]')
        .val();
      if (!variant_id) {
        variant_id = productItem.find('input[name=id]')
          .val();
      }
      //console.log(productItem, variant_id);
      let quantity = productItem.find('input[name=quantity]')
        .val();
      // check qty
      if (!quantity || quantity == 0) {
        quantity = 1;
      }

      $('.overlay')
        .addClass('hide');
      smartosc.doAjaxAddToCart(variant_id, quantity, productItem);
      return false;
    });
}

// Ajax add to cart
//
smartosc.doAjaxAddToCart = function(variant_id, quantity, productItem) {
  $.ajax({
    type: "post",
    url: "/cart/add.js",
    data: 'quantity=' + quantity + '&id=' + variant_id,
    dataType: 'json',
    beforeSend: function() {
      $('.smart-loading')
        .show();
    },
    success: function(response) {
      productItem.find('.prd__error-message')
        .html('');
      $('.quickview-popup')
        .hide()
        .html('');
      smartosc.updateMiniCart();
      return false;
    },
    error: function(xhr, text) {
      $('.smart-loading')
        .hide();
      $('body > .overlay')
        .addClass('hide');
       var messageDisplay = $.parseJSON(xhr.responseText).description;
      if(document.documentElement.lang == "en"){
		var quantityCurrent = $('[value="'+variant_id+'"]').data('quantity');
        messageDisplay = 'There is only ' + quantityCurrent +' left of this item, which has been added to your cart.'
	  }
      productItem.find('.prd__error-message')
        .text(messageDisplay);
    }
  });
}


smartosc.addToCartMulti = function() {
  $(document)
    .on('click', '.btn__addtocarts', function(e) {
      e.preventDefault();

      let data = [
        {quantity: 1, id: 35130902970533},
        {quantity: 1, id: 35130937802917},
        {quantity: 1, id: 35130045005989}
      ];
      $('.overlay').addClass('hide');
      smartosc.doAjaxAddToCartMulti(data);
      return false;
    });
}
smartosc.doAjaxAddToCartMulti = function(data) {

  $.ajax({
    type: "post",
    url: "/cart/add.js",
    data: {items: data},
    dataType: 'json',
    beforeSend: function() {

      $('.smart-loading').show();
    },
    success: function(response) {

      // productItem.find('.prd__error-message').html('');
      // $('.quickview-popup').hide().html('');
      smartosc.updateMiniCart();

      return false;
    },
    error: function(xhr, text) {
      $('.smart-loading').hide();

      console.log($.parseJSON(xhr.responseText).description);
      // $('body > .overlay').addClass('hide');
      // $('.error__addtocarts').text($.parseJSON(xhr.responseText).description);
    }
  });
}
// Update cart ajax
//
smartosc.updateMiniCart = function() {
  let urlCart = '/cart.js';
  if ($('#lang-list .disclosure-list__item.disclosure-list__item--current').length > 0) {
    let dataLocal = $('#lang-list .disclosure-list__item.disclosure-list__item--current')
      .data('locale_url');
    if (dataLocal.length > 1) {
      urlCart = dataLocal + '/cart.js';
    }
  }
  jQuery.getJSON(urlCart, function(cart) {
    smartosc.doUpdateCartListItem(cart);
  });
  // Shopify.getCart(function(cart) {
  //     smartosc.doUpdateCartListItem(cart);
  // });
}

// Update remove item in mini cart
//
smartosc.removeItemCartUpdate = function() {
  Shopify.getCart(function(cart) {
    // Update cart count
    $('#CartCount .count_desktop[data-cart-count]')
      .html('(' + cart.item_count + ')');
	$('#CartCount .count_mobile[data-cart-count]')
      .html(cart.item_count);
    // Update total
    $('.minicart__total-price')
      .html(theme.Currency.formatMoney(cart.total_price, theme.moneyFormat));
    if (theme.settings.miniCartType == 'canvas') {
      $('.offcanvas-cart__count span')
        .html(cart.item_count);
    }
  });
}

// Update and push item in mini cart
//
smartosc.doUpdateCartListItem = function(cart) {
  let template = '<li class="minicart__item" data-product_id="{ID}" data-cart-item-index="{INDEX}">';
  template += '<div class="minicart__media">';
  template += '<a href="{URL}" title="{TITLE}" class="minicart__image">';
  template += '<img src="{IMAGE}" alt="{TITLE}">';
  template += '</a>';
  template += '<a href="javascript:void(0)"  title="Remove This Item" class="minicart__remove"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><g><path d="M3.6,21.0c-0.1-0.1-0.2-0.3-0.2-0.4v-15H2.2C2,5.7,1.9,5.6,1.7,5.5C1.6,5.4,1.6,5.2,1.6,5.1c0-0.2,0.1-0.3,0.2-0.4C1.9,4.5,2,4.4,2.2,4.4h5V1.9c0-0.2,0.1-0.3,0.2-0.4c0.1-0.1,0.3-0.2,0.4-0.2h6.3c0.2,0,0.3,0.1,0.4,0.2c0.1,0.1,0.2,0.3,0.2,0.4v2.5h5c0.2,0,0.3,0.1,0.4,0.2c0.1,0.1,0.2,0.3,0.2,0.4c0,0.2-0.1,0.3-0.2,0.4c-0.1,0.1-0.3,0.2-0.4,0.2h-1.3v15c0,0.2-0.1,0.3-0.2,0.4c-0.1,0.1-0.3,0.2-0.4,0.2H4.1C3.9,21.3,3.7,21.2,3.6,21.1z M17.2,5.7H4.7v14.4h12.5V5.7z M8.3,9c0.1,0.1,0.2,0.3,0.2,0.4v6.9c0,0.2-0.1,0.3-0.2,0.4c-0.1,0.1-0.3,0.2-0.4,0.2s-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.3-0.2-0.4V9.4c0-0.2,0.1-0.3,0.2-0.4c0.1-0.1,0.3-0.2,0.4-0.2S8.1,8.9,8.3,9z M8.4,4.4h5V2.6h-5V4.4z M11.4,9c0.1,0.1,0.2,0.3,0.2,0.4v6.9c0,0.2-0.1,0.3-0.2,0.4c-0.1,0.1-0.3,0.2-0.4,0.2s-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.3-0.2-0.4V9.4c0-0.2,0.1-0.3,0.2-0.4c0.1-0.1,0.3-0.2,0.4-0.2S11.3,8.9,11.4,9z M13.6,9c0.1-0.1,0.3-0.2,0.4-0.2s0.3,0.1,0.4,0.2c0.1,0.1,0.2,0.3,0.2,0.4v6.9c0,0.2-0.1,0.3-0.2,0.4c-0.1,0.1-0.3,0.2-0.4,0.2s-0.3-0.1-0.4-0.2c-0.1-0.1-0.2-0.3-0.2-0.4V9.4C13.4,9.3,13.5,9.1,13.6,9z"></path></g></svg></a>';
  template += '</div>';
  template += '<div class="minicart__content">';
  template += '<div class="minicart__title">';
  template += '<a href="{URL}">{TITLE}</a>';
  template += '</div>';
  template += '<div class="minicart__price {CLASS_ON_SALE}">';
  template += '<span class="minicart__price-sale">{PRICE}</span>';
  template += '<span class="minicart__price-compare">{PRICE_COMPARE}</span>';
  template += '</div>';
  template += '<div class="minicart__quantity">';
  template += '<span class="minicart__quantity-title">Quantity:</span>';
  template += '<span class="minicart__quantity-number">{QUANTITY}</span>';
  template += '</div>';
  template += '</li>';

  // update cart count
  $('#CartCount .count_desktop[data-cart-count]')
    .html('('+cart.item_count+')');
  $('#CartCount .count_mobile[data-cart-count]')
    .html(cart.item_count);
  $('.minicart__total-price')
    .html(theme.Currency.formatMoney(cart.total_price, theme.moneyFormat));
  $('#CartCount')
    .removeClass('hide');
  $('.minicart__list')
    .html('');

  if (cart.item_count > 0) {
    for (var i = 0; i < cart.items.length; i++) {
      var item = template;
      var cart_item = cart.items[i];
      var dataIndex = i + 1;

      item = item.replace(/\{ID\}/g, cart_item.id);
      item = item.replace(/\{INDEX\}/g, dataIndex);
      item = item.replace(/\{URL\}/g, cart_item.url);
      item = item.replace(/\{TITLE\}/g, cart_item.title);
      item = item.replace(/\{QUANTITY\}/g, cart_item.quantity);
      item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart_item.image, '90x'));
      item = item.replace(/\{PRICE\}/g, theme.Currency.formatMoney(cart_item.price, theme.moneyFormat));


      // cart check Compare At Price
      let hasDiscount = false;
      if(cart_item.original_price !=  cart_item.final_price) hasDiscount= true;


      if(hasDiscount){
        // cart check Crocs At Price
        item = item.replace(/\{PRICE\}/g, theme.Currency.formatMoney(cart_item.final_price, theme.moneyFormat));
        item = item.replace(/\{PRICE_COMPARE\}/g, theme.Currency.formatMoney(cart_item.final_price, theme.moneyFormat));
        item = item.replace(/\{CLASS_ON_SALE\}/g, 'on-crocs');
      }else{

        item = item.replace(/\{PRICE\}/g, theme.Currency.formatMoney(cart_item.price, theme.moneyFormat));

        // cart check Compare At Price
        var cart_cp_price = smartosc.cartCompareAtPrice(cart_item); // get cart_compare_price
        if (cart_cp_price > cart_item.price) {
          item = item.replace(/\{PRICE_COMPARE\}/g, theme.Currency.formatMoney(cart_cp_price, theme.moneyFormat));
          item = item.replace(/\{CLASS_ON_SALE\}/g, 'on-sale');
        } else {
          item = item.replace(/\{PRICE_COMPARE\}/g, '');
          item = item.replace(/\{CLASS_ON_SALE\}/g, '');
        }
      }

      $('.minicart__list')
        .append(item);
    }
    // Remove class no-item
    $('.site-header__cart')
      .removeClass('no-item');
    if (theme.settings.miniCartType == 'canvas') {
      $('.offcanvas-cart__count span')
        .html(cart.item_count);
      $('.offcanvas--right')
        .addClass('active');
      $('.offcanvas--right .overlay')
        .removeClass('hide');
      $('body')
        .addClass('overflow-hidden');
    } else {
      // Update popup
      $('.minicart__wrapper')
        .clone()
        .appendTo('.minicart__popup .popup__content');
      $('.overlay')
        .removeClass('hide');
      $('.minicart__popup')
        .show();
    }
  } else {
    $('.offcanvas-cart__count span')
      .html(0);
    $('#CartCount .count_desktop[data-cart-count]')
      .html('(0)');
    $('#CartCount .count_mobile[data-cart-count]')
      .html(0);
  }
  $('.smart-loading')
    .hide();
}

// Get price compare to update in mini cart
//
smartosc.cartCompareAtPrice = function(item) {
  var cart_compare_price = 0;
  $.ajax({
    url: '/products/' + item.handle + '.js',
    dataType: 'json',
    async: false,
    success: function(product) {
      product.variants.forEach(function(variant) {
        if (variant.compare_at_price != null && variant.id == item.variant_id) {
          cart_compare_price = variant.compare_at_price;
        }
      });
    }
  });
  return cart_compare_price;
}

// Hiden popup minicart
//
smartosc.hidenPopupMiniCart = function() {
  $(document)
    .on('click', '.minicart__popup .close, .smart_modal.minicart__popup', function(e) {
      e.preventDefault();
      if (e.target.className.includes('smart_modal') || e.target.className.includes('close')) {
        $('.smart_modal.minicart__popup')
          .hide();
        $('.minicart__popup .popup__content')
          .html('');
        $('.overlay')
          .addClass('hide');
      }
    });
}

// Canvas mini cart
//
smartosc.canvasCart = function() {
  smartosc.showCanvasCart();
  smartosc.hidenCanvasCart();
}

// Action show canvas cart
//
smartosc.showCanvasCart = function() {
  $(document)
    .on('click', '.site-header__cart .site-header__icon', function(e) {
      e.preventDefault();
      $('.offcanvas--right')
        .addClass('active');
      $('.offcanvas--right .overlay')
        .removeClass('hide');
      $('body')
        .addClass('overflow-hidden');
    });
}

// Action hiden canvas cart
//
smartosc.hidenCanvasCart = function() {
  $(document)
    .on('click', '.offcanvas-cart .close, .offcanvas--right .overlay', function(e) {
      $('.offcanvas--right')
        .removeClass('active');
      $('body')
        .removeClass('overflow-hidden');
    });
}

// Action remove item in cart
//
smartosc.removeItemCart = function() {
  $(document)
    .on('click', '.minicart__remove', function(e) {
      e.preventDefault();
      let productID = $(this)
        .closest('.minicart__item')
        .data('product_id');
      $(this)
        .closest('.minicart__item')
        .fadeOut("slow")
        .remove();
      $('.minicart__item[data-product_id=' + productID + ']')
        .remove();
      Shopify.removeItem(productID, function(cart) {
        smartosc.removeItemCartUpdate();
      });
      return false;
    });
}

// Filter
smartosc.filterProduct = function() {
  // Show and hidden filter select
  let filterCountPathUrl = 2;
  if ($('#lang-list .disclosure-list__item.disclosure-list__item--current').length > 0) {
    let dataLocal = $('#lang-list .disclosure-list__item.disclosure-list__item--current')
      .data('locale_url');
    if (dataLocal.length > 1) {
      filterCountPathUrl = 3;
    }
  }
  $('body')
    .on('click', '.filters__wrapper .filters__select-label', function() {
      let checkActive = false;
      let checkSidebar = false;
      if ($(this)
        .parent()
        .hasClass('show-filter')) {
        checkActive = true;
      } else {
        checkActive = false;
      }
      if ($(this)
        .parents('.filters-sidebar').length > 0) {
        checkSidebar = true;
      }
      if (checkSidebar) {
        $(this)
          .parent()
          .toggleClass('show-filter');
      } else {
        $('.filters__wrapper .show-filter')
          .removeClass('show-filter');
        if (checkActive == true) {
          $(this)
            .parent()
            .removeClass('show-filter');
        } else {
          $(this)
            .parent()
            .addClass('show-filter');
        }
      }
    });

  // Action click to filter
  $('body')
    .on('click', '.filters__list a, .filter__active li a', function(e) {
      e.preventDefault();
      $('.smart-loading')
        .show();
      let url = window.location.href,
        pathName = window.location.pathname.replace(/\/+$/, ''),
        input = $(this)
          .parent()
          .find('input');
      sortBy = false,
        currentTags = [],
        sortByQuery = '',
        newUrl = '',
        newpathName = '',
        newQuery = '';
      input.click();
      pathName = pathName.replace(/^\/+/, '');  // remove "/" first
      pathNameArr = pathName.split('/');
      if (pathNameArr.length > filterCountPathUrl) {
        pathNameArr.pop();
        pathName = pathNameArr.join('/');
      }
      // check sortBy
      if (url.includes('?sort_by')) {
        sortBy = true;
        sortByQuery = '?sort_by' + url.split('?sort_by')
          .pop();
      }
      let elTagChecked = $(this)
        .parents('.filters__wrapper')
        .find('input:checked'); // get all input checked
      if (elTagChecked.length > 0) {
        // Create array tags with input checked
        elTagChecked.each(function() {
          currentTags.push($(this)
            .val());
        });
        // Create new query
        newQuery = currentTags.join('+');
        if (sortBy) {
          newQuery += sortByQuery;
        }
      } else {
        newQuery = '';
        if (sortBy) {
          newQuery += sortByQuery;
        }
      }
      // Create new pathName
      newpathName = pathName + '/' + newQuery;
      newUrl = window.location.protocol + '//' + window.location.hostname + '/' + newpathName;
      let pushHistory = '/' + newpathName;

      // Get data
      smartosc.filterAjax(newUrl);
      history.pushState('', 'Collection filter', pushHistory);
    });

  // Clear all filter
  $('body')
    .on('click', '.clear_all_filter', function() {
      let pathName = window.location.pathname.replace(/\/+$/, '');
      pathName = pathName.replace(/^\/+/, '');
      let pathNameArr = pathName.split('/');
      let newUrl = window.location.href;
      if (pathNameArr.length > filterCountPathUrl) {
        pathNameArr.pop();
        pathName = pathNameArr.join('/');
        newUrl = window.location.protocol + '//' + window.location.hostname + '/' + pathName;
      }
      window.location = newUrl;
    });
}

// Filter ajax get content
smartosc.filterAjax = function(url) {
  $.ajax({
    type: 'get',
    url: url,
    beforeSend: function() {
    },
    success: function(data) {
      smartosc.filterUpdatePage(data);
      $('.smart-loading')
        .hide();
      $('body')
        .removeClass('overflow-hidden');
      var sectionsFilter = new theme.Sections();
      sectionsFilter.register('collection-template', theme.Filters);
    },
    error: function(xhr, text) {
      $('.smart-loading')
        .hide();
      alert($.parseJSON(xhr.responseText).description);
    }
  });
}
smartosc.filterUpdatePage = function(data) {
  // Update filter content
  let elfilter = $('.filters-toolbar-wrapper');
  let filterContent = $(data)
    .find('.filters-toolbar-wrapper');
  elfilter.replaceWith(filterContent);

  // Update collection content
  let elCollection = $('#Collection');
  let content = $(data)
    .find('#Collection');
  elCollection.replaceWith(content);
  smartosc.sbProductSlide();
}


// Sidebar
smartosc.sbProductSlide = function() {
  var sbProductSlide = new Swiper('.sidebar_product_slide', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
smartosc.sbToggleMobile = function() {
  $('body')
    .on('click', '.sidebar__toggle, .sidebar__toggle-close', function() {
      $('.smart__sidebar')
        .toggleClass('show');
      $('body')
        .toggleClass('overflow-hidden');
    });
}


// Slider function
smartosc.ssSlider = function(el) {
  el.each(function() {
    let el = $(this);
    let nav = el.data('nav'),
      page = el.data('page'),
      centerMod = el.data('center'),
      itemMB = el.data('mb'),
      itemDK = el.data('dk');
    let centeredSlides = false,
      loopSlides = false;
    if (centerMod == true) {
      centeredSlides = true;
      loopSlides = true;
    }
    var swiperProductSl = new Swiper(this, {
      centeredSlides: centeredSlides,
      loop: loopSlides,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: el.find('.swiper-button-next'),
        prevEl: el.find('.swiper-button-prev'),
      },
      pagination: {
        el: el.find('.swiper-pagination'),
        clickable: true
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: itemMB,
          spaceBetween: 5
        },
        // when window width is >= 640px
        1024: {
          slidesPerView: itemDK,
          spaceBetween: 10
        }
      }
    });
  });
}

smartosc.smartSlider = function(el) {
  el.each(function() {
    let el = $(this);
    let enableAutoplay = '';
    let spaceBetween = el.data('spacebetween'),
      page = el.data('page'),
      centerMod = el.data('center'),
      itemMB = el.data('mb'),
      itemTB = el.data('tb'),
      itemDK = el.data('dk'),
      itemAutoplay = el.data('autoplay');

    let centeredSlides = false,
      loopSlides = false;
    if (centerMod == true) {
      centeredSlides = true;
      loopSlides = true;
    }
    const delayAutoplay = {delay: 3000, disableOnInteraction: true}
    if (itemAutoplay == true && itemAutoplay !='undefined') {
      enableAutoplay = delayAutoplay;
    } else {
      enableAutoplay = false;
	}

    var swiperProductSl = new Swiper(this, {
      centeredSlides: centeredSlides,
      loop: loopSlides,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: el.parent()
          .find('.swiper-button-next'),
        prevEl: el.parent()
          .find('.swiper-button-prev'),
      },

      autoplay: enableAutoplay,
      pagination: {
        el: el.find('.swiper-pagination'),
        clickable: true
      },
      breakpoints: {
        0: {
          slidesPerView: itemMB,
          spaceBetween: 5
        },
        480: {
          slidesPerView: itemTB,
          spaceBetween: 5
        },
        991: {
          slidesPerView: parseInt(itemTB) + 1,
          spaceBetween: spaceBetween
        },
        1025: {
          slidesPerView: parseInt(itemDK) - 1,
          spaceBetween: spaceBetween

        },
        1200: {
          slidesPerView: itemDK,
          spaceBetween: spaceBetween

        }
      }
    });
  });
}

// Section slider product
smartosc.ssProductSl = function() {
  smartosc.ssSlider($('.swiper-container.product_sl'));
}


// Section slider product
smartosc.collectionsSlider = function() {
  smartosc.smartSlider($('.swiper-container.smartSlider'));
}


// Section logo slider
smartosc.ssLogoSl = function() {
  smartosc.ssSlider($('.logo_sl'));
}


// menu mobile
smartosc.menuHeader = function() {
  if ($('.canvasmenu__mobile').length > 0) {
    // show and hiden canvas
    $('body')
      .on('click', '.canvasmenu__mobile .js-mobile-nav-toggle', function() {
        $('.canvasmenu__mobile')
          .toggleClass('show_canvas');
      });
    // show submenu
    $('body')
      .on('click', '.canvasmenu__mobile li[data-has-dropdowns] .has-subMenu', function(e) {
        e.preventDefault();
        $(this).parents('.site-nav--has-dropdown').addClass('show_submenu');
        $(this)
          .parents('ul')
          .addClass('show_children');
        $('.canvas__menu-back').show();
      });
    // close menu canvas
    $('body')
      .on('click', '.canvas__menu-close, .canvas__menu-overlay', function() {
        $('.canvasmenu__mobile')
          .removeClass('show_canvas');
        setTimeout(function() {
          $('.canvasmenu__mobile ul')
            .removeClass('show_children');
          $('.canvasmenu__mobile li')
            .removeClass('show_submenu');
        }, 400);
      });
    // Back
    $('body')
      .on('click', '.canvasmenu__mobile .canvas__menu-back', function() {
        let countItem = $('.show_submenu').length;
        let el = $('.show_submenu')
          .eq(countItem - 1);
        el.parent()
          .removeClass('show_children');
        el.removeClass('show_submenu');
        if (countItem == 1) {
          $('.canvas__menu-back')
            .hide();
        }
      });
  }

  if (window.innerWidth < 780) {
    if ($('.dropdownmenu__mobile').length > 0) {
      $('body')
        .on('click', '.js-mobile-nav-toggle', function() {
          $('.header_navigation')
            .toggleClass('small--hide');
        });
      $('body')
        .on('click', '.site-nav--has-dropdown > button', function() {
          if ($(this)
            .parent()
            .hasClass('site-nav--active-dropdown')) {
            $('.site-nav--has-dropdown')
              .removeClass('site-nav--active-dropdown');
          } else {
            $('.site-nav--has-dropdown')
              .removeClass('site-nav--active-dropdown');
            $(this)
              .parent()
              .addClass('site-nav--active-dropdown');
          }
          $('.site-nav-lv-3')
            .removeClass('active');
        });

      $('body')
        .on('click', '.site-nav-lv-3', function() {
          $(this)
            .toggleClass('active');
        });
    }
  }
}

// Tabs
smartosc.tabsCustom = function() {
  $('.smosc__tab-headers a.smosc__tab-header').click(function(e) {
      e.preventDefault();
      $(".smosc__tab-content")
        .removeClass('active');
      $(".smosc__tab-content[data-id='" + $(this)
        .attr('data-id') + "']")
        .addClass("active");
      $(".smosc__tab-header")
        .removeClass('active');
      $(this)
        .addClass('active');
    });
}

// cart-term-conditions-checkbox
smartosc.termConditionsCheckout = function() {
  $('body')
    .on('click', '.cart-term-conditions', function() {
      let elInput = $(this)
        .find('input');
      if (elInput.is(":checked")) {
        elInput.prop('checked', false);
        $(this)
          .parents('.minicart__action')
          .find('.minicart__button-checkout')
          .attr('disabled', 'disabled');
        $(this)
          .parents('.minicart__action')
          .find('.minicart__button-checkout')
          .addClass('disabled');
        $('.shopify-payment-button')
          .removeClass('active');
      } else {
        elInput.prop('checked', true);
        $(this)
          .parents('.minicart__action')
          .find('.minicart__button-checkout')
          .removeAttr('disabled', 'disabled');
        $(this)
          .parents('.minicart__action')
          .find('.minicart__button-checkout')
          .removeClass('disabled');
        $('.shopify-payment-button')
          .addClass('active');
      }
    });
}

// Instagram
smartosc.instagram = function(){
  let keyAPI = $('.instagram-main').data('access_token'),
          limitIns = $('.instagram-main').data('limit');

  if (keyAPI) {
    const feed = new Instafeed({
      target: 'interiordesign',
      accessToken: `${keyAPI}`,
      template: '<div class="instagram-item"> <a href="{' + '{link}}" id="{' + '{id}}"><div class="instagram__wrap"> <img class="lazyload" src="{' + '{image}}" /> <div class="instagram__wrap-content"><div class="caption"> {' + '{caption}} </div></div> </div> </a> </div>',
      sortBy: 'most-recent',
      limit: limitIns,
      filter: function(image) {
        var newCaption = [];
        var captionParts;
        if (image.caption > 0) {
          captionParts = image.caption.text.split(' ');

          for (var i = 0; i < captionParts.length; i++) {

            if (captionParts[i].charAt(0) !== '#furnituredesign') {
              newCaption.push(captionParts[i]);
            }
          }
        }
        image.caption_without_tags = newCaption.join(' ');
        return true; // so we don't exclude any images
      },
      after: function() {
        const instagramItem = $('#interiordesign > .instagram-item');
        instagramItem.each(function(index) {
          $(this).addClass('instagram-item' + index);
        });
      }
    });
    feed.run();
  }
}


// scrollToTop
smartosc.scrollToTop = function() {
  const scrollToTop = $('.scrollToTop');
  // scrollToTop.addClass("hidden-top");
  $(window)
    .scroll(function() {
      if ($(this)
        .scrollTop() === 0) {
        scrollToTop.removeClass("active")
      } else {
        scrollToTop.addClass("active")
      }
    });

  scrollToTop.click(function() {
    $('body,html')
      .animate({scrollTop: 0}, 500);
    return false;
  });


}

//ReinitView
smartosc.reinitView = function() {
  $('.filters-toolbar__pageGrid .btn')
    .bind("click", function() {
      $(this)
        .parent()
        .find('.btn')
        .removeClass('active');
      $(this)
        .addClass('active');
    });

  // Product List
  $('#grid-view3')
    .click(function() {
      $('.grid--view-items')
        .removeClass('productListSmaller')
        .addClass('productListNormal');
      localStorage.setItem('listview', 'grid3');
    });

  // Product Grid
  $('#grid-view4')
    .click(function() {
      $('.grid--view-items')
        .removeClass('productListNormal')
        .addClass('productListSmaller');
      localStorage.setItem('listview', 'grid4');
    });

  if (typeof gridview != 'undefined') {
    if (localStorage.getItem('listview') === null) {
      localStorage.setItem('listview', gridview);
    }
  }


  if (localStorage.getItem('listview') == 'grid3') {
    $('#grid-view3')
      .trigger('click');
  } else if (localStorage.getItem('listview') == 'grid4') {
    $('#grid-view4')
      .trigger('click');
  } else {
    $('#grid-view3')
      .trigger('click');
  }

}

// Accordion
smartosc.accordion = function() {
  const smartAccordion = $('ul.smart-accordion > li');
  if(smartAccordion.length > 0){
    const accordionHeading = $(".accordion-heading"),
            accordionContent = $(".smart-accordion-inner"),
            arrowDownClass = "fa-accordion-down",
            arrowUpClass = "fa-accordion-up";
    accordionHeading.on("click", function() {
      if ($(this)
              .hasClass("active")) {
        $(this)
                .removeClass("active");
        $(this)
                .siblings(accordionContent)
                .slideUp(200);
        $(this)
                .find(".fa")
                .removeClass(arrowUpClass)
                .addClass(arrowDownClass);
      } else {
        $(".accordion-heading > .fa")
                .removeClass(arrowUpClass)
                .addClass(arrowDownClass);

        $(this)
                .find("em")
                .removeClass(arrowDownClass)
                .addClass(arrowUpClass);
        accordionHeading.removeClass("active");
        $(this)
                .addClass("active");
        accordionContent.slideUp(200);
        $(this)
                .siblings(accordionContent)
                .slideDown(200);
      }
    });

  }

  // Newletter - Signup
  const $element = $("#signup");
  const formErrorMessage = $('.form-message--fade'),
    messageClose = $('.form-message--close')
    fromGroupNewletter = $('.input-group--newletter');

  messageClose.click(function() {
    $(formErrorMessage, $element).hide();
    $(fromGroupNewletter, $element).removeClass('input-group--error');
  })

}

//Page custom Services
smartosc.pageCustomServices = function(){
  const menuList = $('ul.splitLeftList > li');

  if(menuList.length > 0){
    const handle = window.location.pathname;
    menuList.each(function(menuItem) {
      const attributeHref = $(this).children().attr("href");
      if(attributeHref === handle)  $(this).addClass('active');
    })
  }

}

smartosc.keepMeLogged = function(){
  const rememberMe = document.getElementById("keep_loggedin"),
          customerEmail = document.getElementById("CustomerEmail");
  if(rememberMe !== null){
    if(localStorage.rememberMe && localStorage.rememberMe !==""){
      rememberMe.setAttribute("checked","checked");
      customerEmail.value = localStorage.userEmail;
    }else{
      rememberMe.removeAttribute("checked");
      customerEmail.value = "";
    }

  }
}

function lsRememberMe(event) {
  const rememberMe = document.getElementById("keep_loggedin"),
        customerEmail = document.getElementById("CustomerEmail");

  if(rememberMe.checked && customerEmail.value !== ""){
    localStorage.userEmail = customerEmail.value;
    localStorage.rememberMe = rememberMe.value;
  }else{
    localStorage.userEmail = "";
    localStorage.rememberMe = "";
  }
}


$(function() {
  /*============================================================================
  Init function
  ==============================================================================*/
  smartosc.init();
});

$(document)
  .on('shopify:section:load', function(e) {
    if (e.target.className.includes('ss-product-slider')) {
      smartosc.ssProductSl();
    }
    if (e.target.className.includes('collections-slider')) {
      smartosc.collectionsSlider();
    }
    if (e.target.className.includes('ss-logo-slider')) {
      smartosc.ssLogoSl();
    }
    if (e.target.className.includes('ss-products-tab')) {
      smartosc.tabsCustom();
      smartosc.ssProductSl();
    }
    if (e.target.className.includes('ss-product-detail')) {
      smartosc.prdDetail();
      smartosc.tabsCustom();
    }
  });
