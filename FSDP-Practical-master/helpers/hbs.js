const moment = require('moment');


module.exports = {
    formatDate: function (date, targetFormat) {
        return moment(date).format(targetFormat);
    },

    //radioCheck
    radioCheck: function (value, radioValue){
        if (value != radioValue) {
            return "";
        }
        return 'checked';
    },
};