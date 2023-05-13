document.addEventListener('DOMContentLoaded', function () {
  document.querySelector(
    '.input-checkbox[name="checkout[remember_me]"]'
  ).checked = true;

  const input_phone = document.querySelector(
    '#checkout_shipping_address_phone'
  );

    const input_email = document.querySelector(
    '#checkout_email'
  );
    if (input_email) {
      
    }

  if (input_phone) {
    const value = input_phone.value;
    input_phone.value = value.replaceAll(' ', '');
    console.log(value);
    if (value.length < 10 || value.length > 13) {
      //document.querySelector('#continue_button').setAttribute('disabled', true);
    } else {
      //document.querySelector('#continue_button').removeAttribute('disabled');
    }
    input_phone.addEventListener('keyup', function () {
      const value = input_phone.value;
      input_phone.value = value.replaceAll(' ', '');
      if (value.length < 10 || value.length > 13) {
        document
          .querySelector('#continue_button')
          .setAttribute('disabled', true);
       
      } else {
        document.querySelector('#continue_button').removeAttribute('disabled');
      }
    });
  }
});

