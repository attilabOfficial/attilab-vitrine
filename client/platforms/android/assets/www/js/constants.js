/**
*
*   Constants
*
**/

EVENTS = {

  CONNECTED    : 0x00,
  DISCONNECTED : 0x01,
  MOVE_RIGHT   : 0x02,
  MOVE_LEFT    : 0x03,
  MOVE_UP      : 0x04,
  MOVE_DOWN    : 0x05,
  VALIDATE     : 0x06,
  BACK         : 0x07,
  HOME         : 0x08,
  CATALOG      : 0x09,
  ABOUT        : 0x0A

};

ACTIONS = {

  'up'        : EVENTS.MOVE_UP,
  'left'      : EVENTS.MOVE_LEFT,
  'right'     : EVENTS.MOVE_RIGHT,
  'down'      : EVENTS.MOVE_DOWN,
  'validate'  : EVENTS.VALIDATE,
  'back'      : EVENTS.BACK,
  'home'      : EVENTS.HOME,
  'catalog'   : EVENTS.CATALOG,
  'about'     : EVENTS.ABOUT

}

MODES = {
  TEST      : 0x00, // for same-computer tests only
  BLUETOOTH : 0x01
};

MODE = MODES.BLUETOOTH;
NB_COL = 4; // Column number
