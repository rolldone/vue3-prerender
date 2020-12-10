(function(global){
  /* Static Type check allowed type data */
  let staticType = function (inVariable, typeDatas = []) {
    var isWRong = true;
    var closureCondition = function (theVariable, arrayRecordTypeOf) {
      return function (typeDataItem) {
        switch (true) {
          case typeDataItem == Array:
            return Array.isArray(theVariable);
          case typeDataItem == undefined:
          case typeDataItem == null:
            if (theVariable == typeDataItem) {
              return true;
            }
            arrayRecordTypeOf.push(typeDataItem);
            return false;
          case typeof theVariable == typeDataItem.name.toLowerCase():
            return true;
          default:
            arrayRecordTypeOf.push(typeDataItem.name);
            return false;
        }
      };
    };
    var recordTypeOf = [];
    var doCheckStaticType = closureCondition(inVariable, (recordTypeOf = []));
    for (var a = 0; a < typeDatas.length; a++) {
      if (doCheckStaticType(typeDatas[a]) == true) {
        isWRong = false;
        break;
      }
    }
    if (isWRong == true) {
      var messageError = `StaticType Validation - value "${inVariable}" is Wrong type of variable, the requirement is ${JSON.stringify(recordTypeOf)}`;
      console.error("staticType - error ", messageError);
      throw new Error(messageError);
    }
  };
  if (typeof define === 'function' && define.amd) {
    /* AMD support */
    define(function(){
      return staticType;
    });
  } else if (typeof module === 'object' && module.exports) {
    /* CJS support */
    module.exports = staticType;
  } else {
    /** @namespace
     * staticType is the root namespace for all staticType.js functionality.
     */
    global.StaticType = staticType;
  }
})(window);