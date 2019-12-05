radio.setFireflyInterval(1000)
radio.onFireflyTick(function () {
    led.toggle(0, 0)
})
radio.onFireflySync(function () {
    led.toggle(1,0)
})
