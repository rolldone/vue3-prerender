const CommonAsset = async (to, from, done, nextMiddleware) => {
  require.ensure([], function() {
    require("nprogress/nprogress.css");
    require("@asset/v1/css/backend.scss");
    require("@asset/semantic/dist/semantic.min.js");
    require("../../base/BaseCommon.js");
    require("../../base/Swal.js");
    nextMiddleware();
  });
};

export default CommonAsset;
