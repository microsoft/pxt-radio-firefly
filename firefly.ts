/**
 * Uses radio to synchronize a mesh of devices
 */
namespace radio {
    const RADIO_ID_FIREFLY = 2100;
    const RADIO_FIREFLY_REMOTE_TICK = 1;
    const RADIO_FIREFLY_SELF_TICK = 1;
    const RADIO_FIREFLY_SYNC = 2;

    const CLOCK_PERIODS_2 = 3;
    const CLOCK_PERIODS = 1 << CLOCK_PERIODS_2;

    // the clock ticker
    let fireflyEnabled = false;
    let fireflyInterval = 400;
    let fireflyTickInterval = fireflyInterval >> CLOCK_PERIODS_2;
    let fireflyTicks = 0
    let fireflyNeighborsTicks = 0;

    function init() {
        if (fireflyEnabled) return;

        fireflyEnabled = true;
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_REMOTE_TICK, function () {
            if (fireflyTicks < CLOCK_PERIODS)
                fireflyTicks += 1;
            fireflyNeighborsTicks += 1;
        })
        control.inBackground(function () {
            while (fireflyEnabled) {
                // if clock hits noon, flash the screen
                if (fireflyTicks >= CLOCK_PERIODS) {
                    // notify neighbors
                    radio.raiseEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_REMOTE_TICK);
                    // run event
                    control.raiseEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SYNC);
                    // wait for 2 ticks
                    basic.pause(fireflyTickInterval * 2)
                    // reset the clock
                    fireflyTicks = 0
                    fireflyNeighborsTicks = 0
                } else {
                    // wait for tick
                    basic.pause(fireflyTickInterval)
                    // increment the clock
                    fireflyTicks += 1
                }
            }
        })
    }

    /**
     * Registers code to run when neigbhoring radios are synched
     */
    //% help=radio/on-firefly-sync
    //% blockId=radio_onfireflysync block="radio on firefly sync"
    //% weight=50
    export function onFireflySync(handler: () => void) {
        init();
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SYNC, handler);
    }

    /**
     * Raises when an internal tick is raised
     */
    export function onFireflyTick(handler: () => void) {
        init();
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SELF_TICK, handler);
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
        init();
        fireflyInterval = Math.max(40, millis);
        fireflyTickInterval = fireflyInterval >> CLOCK_PERIODS_2;
    }

    /**
     * Gets the tick index in the firefly clock.
     */
    //% blockId=radio_fireflytick blokc="radio firefly tick"
    export function fireflyTick() {
        init();
        return fireflyTicks;
    }

    /**
     * Gets an estimage of the numer of neighbords
    */
    //% blockId=radio_fireflyneighbors block="radio firefly neighbors"
    //% weight=48
    export function fireflyNeighbors() {
        init();
        return fireflyNeighborsTicks >> CLOCK_PERIODS_2;
    }
}