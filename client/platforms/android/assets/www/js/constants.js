/**
*
*   Constants
*
**/

EVENTS = {

  CONNECTED               : 0x00,
  DISCONNECTED            : 0x01,
  MOVE_RIGHT              : 0x02,
  MOVE_LEFT               : 0x03,
  MOVE_UP                 : 0x04,
  MOVE_DOWN               : 0x05,
  VALIDATE                : 0x06,
  RELEASED                : 0x07,
  BACK                    : 0x08,
  HOME                    : 0x09,
  CATALOG                 : 0x0A,
  OPTION                  : 0x0B,
  ABOUT                   : 0x0C,
  ROBOT_START             : 0x0D,
  ROBOT_FORWARD           : 0x0E,
  ROBOT_LEFT              : 0x0F,
  ROBOT_RIGHT             : 0x10,
  ROBOT_BACKWARD          : 0x11,
  ROBOT_STOP              : 0x12,
  ROBOT_LONG_JUMP         : 0x13,
  ROBOT_HIGH_JUMP         : 0x14,
  ROBOT_SPIN              : 0x15,
  ROBOT_TAP               : 0x16,
  ROBOT_SLOW_SHAKE        : 0x17,
  ROBOT_METRONOME         : 0x18,
  ROBOT_ONDULATION        : 0x19,
  ROBOT_SPIN_JUMP         : 0x1A,
  ROBOT_SPIN_TO_POSTURE   : 0x1B,
  ROBOT_SPIRAL            : 0x1C,
  ROBOT_SLALOM            : 0x1D,
  ROBOT_BATTERY           : 0x1E,
  ROBOT_STANDING          : 0x1F,
  ROBOT_JUMPER            : 0x20,
  ROBOT_KICKER            : 0x21,
  DOMOTIQUE_ON            : 0x22,
  DOMOTIQUE_OFF           : 0x23,
  MOTION_YES              : 0x24,
  MOTION_NO               : 0x25,
  CAMERA_PHOTO            : 0x26

};

ACTIONS = {

  'up'        : EVENTS.MOVE_UP,
  'left'      : EVENTS.MOVE_LEFT,
  'right'     : EVENTS.MOVE_RIGHT,
  'down'      : EVENTS.MOVE_DOWN,
  'validate'  : EVENTS.VALIDATE,
  'back'      : EVENTS.BACK,
  'home'      : EVENTS.HOME,
  'option'    : EVENTS.OPTION,
  'catalog'   : EVENTS.CATALOG,
  'about'     : EVENTS.ABOUT

}

MODES = {
  TEST      : 0x00, // for same-computer tests only
  BLUETOOTH : 0x01
};

MODE = MODES.BLUETOOTH;
NB_COL = 4; // Column number
