/**
 * Decentralized synchronization of messages over radio
 * similar to Fireflies in the wild.
 */
//% weight=95
//% color=#E3008C icon="\uf012"
namespace firefly {
    const RADIO_ID_FIREFLY = 2100;
    const RADIO_FIREFLY_REMOTE_TICK = 1;
    const RADIO_FIREFLY_SELF_TICK = 2;
    const RADIO_FIREFLY_CORRECTION_TICK = 3;
    const RADIO_FIREFLY_SYNC = 4;

    const CLOCK_PERIODS_2 = 3;
    const CLOCK_PERIODS = 1 << CLOCK_PERIODS_2;

    // the clock ticker
    let fireflyEnabled = false;
    let fireflyInterval = 800;
    let fireflyTickInterval = fireflyInterval >> CLOCK_PERIODS_2;
    let fireflyTicks = 0
    let fireflyNeighborsTicks = 0;
    let lastFireflyNeighborsTicks = 0;

    function handleRemoteTick() {
        fireflyNeighborsTicks += 1;
        if (fireflyTicks < CLOCK_PERIODS) {
            fireflyTicks += 1;
            control.raiseEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_CORRECTION_TICK);
        }
    }

    function handleTick() {
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
            // keep track of how many neighbors were detected
            lastFireflyNeighborsTicks = fireflyNeighborsTicks;
            fireflyNeighborsTicks = 0
        } else {
            // raise self tick
            radio.raiseEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SELF_TICK);
            // wait for tick
            basic.pause(fireflyTickInterval);
            // increment the clock
            fireflyTicks += 1;
        }
    }

    function init() {
        if (fireflyEnabled) return;

        fireflyEnabled = true;
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_REMOTE_TICK, handleRemoteTick)
        control.inBackground(function () {
            while (fireflyEnabled)
                handleTick();
        })
    }

    /**
     * Registers code to run when neigbhoring radios are synched
     */
    //% blockId=radio_onfireflysync block="on firefly sync"
    //% weight=50
    export function onSync(handler: () => void) {
        init();
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SYNC, handler);
    }

    /**
     * Raises when an internal tick is raised
     */
    //% weight=49
    //% blockId=radio_onfireflytick block="on firefly tick"
    export function onTick(handler: () => void) {
        init();
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_SELF_TICK, handler);
    }

    /**
     * Raise an even the firefly tick is corrected
     */
    //% weight=49
    //% blockId=radio_onfireflycorrection block="on firefly correction"
    export function onCorrection(handler: () => void) {
        init();
        control.onEvent(RADIO_ID_FIREFLY, RADIO_FIREFLY_CORRECTION_TICK, handler);
    }

    /**
     * Sets the firefly interval
     * @param millis millisecond between synchronizations, eg: 1000
     */
    //% help=radio/set-firefly-interval
    //% blockId=radio_setfireflyinterval block="set firefly interval $millis (ms)"
    //% millis.shadow=timePicker
    //% weight=49
    export function setInterval(millis: number) {
        init();
        fireflyInterval = Math.max(40, millis);
        fireflyTickInterval = fireflyInterval >> CLOCK_PERIODS_2;
    }

    /**
     * Gets the tick index in the firefly clock.
     */
    //% blockId=radio_fireflytick block="firefly ticks"
    //% weight=48
    export function ticks() {
        init();
        return fireflyTicks;
    }

    /**
     * Gets the number of remote ticks received
    */
    //% blockId=radio_fireflyneighbors block="firefly remote ticks"
    //% weight=47
    export function remoteTicks() {
        init();
        return lastFireflyNeighborsTicks;
    }
}