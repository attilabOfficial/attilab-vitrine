cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
        "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    },
    {
        "file": "plugins/cordova-plugin-ble-central/www/ble.js",
        "id": "cordova-plugin-ble-central.ble",
        "clobbers": [
            "ble"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-save-image-gallery/www/saveImageGallery.js",
        "id": "cordova-save-image-gallery.saveImageGallery",
        "clobbers": [
            "cordova.saveImageGallery"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-socialsharing/www/SocialSharing.js",
        "id": "cordova-plugin-x-socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-bluetooth-serial": "0.4.5",
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-ble-central": "1.1.0",
    "cordova-plugin-statusbar": "2.1.3",
    "cordova-plugin-inappbrowser": "1.4.0",
    "cordova-save-image-gallery": "0.0.20",
    "cordova-plugin-x-socialsharing": "5.1.1"
};
// BOTTOM OF METADATA
});