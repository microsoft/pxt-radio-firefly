/**
 * Uses radio to synchronize a mesh of devices
 */
namespace radio {
    const RADIO_ID_FIREFLY = 2100;
    const RADIO_FIREFLY_TICK = 1;
    const RADIO_FIREFLY_SYNC = 1;
    // the clock ticker
    let fireflyInterval = 400;
    let fireflyTickInterval = fireflyInterval / 8;
    let fireflyTicks = 0
    control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_TICK, function () {
        fireflyTicks += 1;
    })
    control.inBackground(function () {
        while (true) {
            // if clock hits noon, flash the screen
            if (fireflyTicks >= 8) {
                // notify neighbors
                radio.raiseEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_TICK);
                // run event
                control.raiseEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SYNC);
                // wait for 2 ticks
                basic.pause(fireflyTickInterval * 2)
                // reset the clock
                fireflyTicks = 0
            } else {
                // wait for tick
                basic.pause(fireflyTickInterval)
                // increment the clock
                fireflyTicks += 1
            }
        }
    })

    /**
     * Registers code to run when neigbhoring radios are synched
     */
    //% help=radio/on-firefly-sync
    //% blockId=radio_onfireflysync block="radio on firefly sync"
    //% weight=50
    export function onFireflySync(handler: () => void) {
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SYNC, handler);
    }

    /**
     * Sets the firefly interval
     * @param millis millisecond between synchronizations, eg: 1000
     */
    //% help=radio/set-firefly-interval
    //% blockId=radio_setfireflyinterval block="radio set firefly interval $millis (ms)"
    //% millis.shadow=timePicker
    //% weight=49
    export function setFireflyInterval(millis: number) {
        fireflyInterval = Math.max(40, millis);
        fireflyTickInterval = fireflyInterval / 8;
    }
}