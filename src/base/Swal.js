import "@asset/sweetalert2/dist/sweetalert2.css";

window.swalDeleted = function (message) {
  return Swal.fire("Deleted!", message, "success");
  return swal.fire({
    imageUrl: "", imageWidth: 100, title: message
    // customClass: 'artywiz-sweetalert'
  });
};

window.swalSuccess = function (title, message, callback) {
  window.staticType(title, [String]);
  window.staticType(message, [null, String, Boolean]);
  return Swal.fire(title, message, "success").then(function (result) {
    if (callback != null) {
      window.staticType(callback, [Function]);
      callback(result);
    }
  });
  return swal({imageUrl: "", imageWidth: 100, title: message, customClass: "artywiz-sweetalert", confirmButtonText: "Ok"});
};

window.swalConfirm = function (props, callback) {
  window.staticType(props.title, [String]);
	window.staticType(props.message, [null, String, Boolean]);
	window.staticType(props.confirmButtonText,[String]);
	window.staticType(props.type,[String]);
  return Swal.fire({
    type: props.type || 'warning',
    title: props.title || "Are you sure?",
    text: props.message,
    showCancelButton: true,
    confirmButtonColor: props.confirmButtonColor || "#1abc9c",
    cancelButtonColor: props.cancelButtonColor || "#95a5a6",
		confirmButtonText: props.confirmButtonText || "Ignore me!",
		cancelButtonText : props.cancelButtonText || 'Cancel'
  }).then(function (result) {
    if (callback != null) {
      window.staticType(callback, [Function]);
      callback(result);
    }
  });
};

window.swalMailSend = function (message) {
  return swal({imageUrl: "", imageWidth: 100, title: message, customClass: "artywiz-sweetalert"});
};

window.swalFailure = function (title, message, callback) {
  window.staticType(title, [String]);
  window.staticType(message, [null, String, Boolean]);
  return Swal.fire(title, message, "error").then(function (result) {
    if (callback != null) {
      window.staticType(callback, [Function]);
      callback(result);
    }
  });
  return swal({
    imageUrl: "/assets/icon-logo/artycoin-atc.svg",
    title: title || "Opps, You are getting error!",
    text: message,
    confirmButtonText: "retourner",
    customClass: "artywiz-sweetalert"
  });
};
