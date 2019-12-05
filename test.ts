radio.setFireflyInterval(1000)
radio.onFireflySync(function () {
    console.log('ping')
})