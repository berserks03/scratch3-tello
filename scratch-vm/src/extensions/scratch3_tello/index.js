const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpiYBgFo2AUjIJRQCzQB+L7QPyfCng/EPNT24HrqeQ4GJ5PjKVMJDjwA5U9/IAYRYwkGAiKkgIgdsAhrwDFyA7A5YgDQNxI7zRajxaF9dQwlGmw58xRB446cNSBow4cdeCoA0cdOOrAUQeOOnDUgYPFgQ9o3Aukat+ZJh3zUTAKRsFQBAABBgCoVDVJPyGtBgAAAABJRU5ErkJggg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpiYBgFo2AUjIJRQCzQB+L7QPyfCng/EPNT24HrqeQ4GJ5PjKVMJDjwA5U9/IAYRYwkGAiKkgIgdsAhrwDFyA7A5YgDQNxI7zRajxaF9dQwlGmw58xRB446cNSBow4cdeCoA0cdOOrAUQeOOnDUgYPFgQ9o3Aukat+ZJh3zUTAKRsFQBAABBgCoVDVJPyGtBgAAAABJRU5ErkJggg==';

const message = {
    connect: {
        'ja': '接続する',
        'ja-Hira': 'せつぞくする',
        'en': 'connect'
    },
    takeoff: {
        'ja': '離陸する',
        'ja-Hira': 'りりくする',
        'en': 'takeoff'
    },
    land: {
        'ja': '着陸する',
        'ja-Hira': 'ちゃくりくする',
        'en': 'land'
    },
    up: {
        'ja': '上に [X]cm 上がる',
        'ja-Hira': 'うえに [X] センチあがる',
        'en': 'up [X] cm'
    },
    down: {
        'ja': '下に [X]cm 下がる',
        'ja-Hira': 'したに [X] センチさがる',
        'en': 'down [X] cm'
    },
    left: {
        'ja': '左に [X]cm 動く',
        'ja-Hira': 'ひだりに [X] センチうごく',
        'en': 'move left [X] cm'
    },
    right: {
        'ja': '右に [X]cm 動く',
        'ja-Hira': 'みぎに [X] センチうごく',
        'en': 'move right [X] cm'
    },
    forward: {
        'ja': '前に [X]cm 進む',
        'ja-Hira': 'まえに [X] センチすすむ',
        'en': 'move forward [X] cm'
    },
    back: {
        'ja': '後ろに [X]cm 下がる',
        'ja-Hira': 'うしろに [X] センチさがる',
        'en': 'move back [X] cm'
    },
    cw: {
        'ja': '[X] 度回転する',
        'ja-Hira': '[X] どまわる',
        'en': 'rotate [X] degrees clockwise'
    },
    ccw: {
        'ja': '[X] 度逆回転する',
        'ja-Hira': '[X] どぎゃくにまわる',
        'en': 'rotate [X] degrees counterclockwise'
    }

};

/**
 * Class for the Tello
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3Tello {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        if (formatMessage.setup().locale === 'ja' || formatMessage.setup().locale === 'ja-Hira') {
            this.locale = formatMessage.setup().locale;
        } else {
            this.locale = 'en';
        }

        return {
            id: 'tello',
            name: 'Tello',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connect',
                    text: message.connect[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'takeoff',
                    text: message.takeoff[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'land',
                    text: message.land[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'up',
                    text: message.up[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'down',
                    text: message.down[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'left',
                    text: message.left[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'right',
                    text: message.right[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'forward',
                    text: message.forward[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'back',
                    text: message.back[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'cw',
                    text: message.cw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'ccw',
                    text: message.ccw[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    connect () {
        telloProcessor.connect();
    }

    takeoff () {
        telloProcessor.send('takeoff');
    }

    land () {
        telloProcessor.send('land');
    }

    up (args) {
        telloProcessor.send(`up ${Cast.toString(args.X)}`);
    }

    down (args) {
        telloProcessor.send(`down ${Cast.toString(args.X)}`);
    }

    left (args) {
        telloProcessor.send(`left ${Cast.toString(args.X)}`);
    }

    right (args) {
        telloProcessor.send(`right ${Cast.toString(args.X)}`);
    }

    forward (args) {
        telloProcessor.send(`forward ${Cast.toString(args.X)}`);
    }

    back (args) {
        telloProcessor.send(`back ${Cast.toString(args.X)}`);
    }

    cw (args) {
        telloProcessor.send(`cw ${Cast.toString(args.X)}`);
    }

    ccw (args) {
        telloProcessor.send(`ccw ${Cast.toString(args.X)}`);
    }

}
module.exports = Scratch3Tello;
