firefly.setInterval(1000)
firefly.onTick(function () {
    led.toggle(0, 0)
})
firefly.onSync(function () {
    led.toggle(1,0)
    if (firefly.hasNeighbors())
        led.plot(2, 0)
    else led.unplot(2,0)
})
