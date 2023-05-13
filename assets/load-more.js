let bss_custom = $(".bss-custom-load-more")
let next_url = bss_custom.data("next-url")

function loadMoreProducts() {
  $.ajax(
    {
      url: next_url,
      type: "GET",
      dataType: "html"
    }
  ).done(function(next_page) {
    let new_products = $(next_page).find(".bss-custom-load-more");
    let new_url - new_products.data('next-url');
    next_url = new_url
    bss_custom.append(new_products.html())
  }
}