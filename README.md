# Radio Firefly

This extension provides a firefly-like protocol to synchronize
devices together.

## Usage

### ``onFireflySync`` 

Use the ``radio.onFireflySync`` event that is raised
on each clock cycle.

```blocks
radio.onFireflySync(function () {
    console.log('sync')
})
```

### ``onFireflyTick`` 

Use the ``radio.onFireflyTick`` event to run on each tick

```blocks
radio.onFireflyTick(function () {
    console.log('tick')
})
```

### ``onFireflyTick`` 

Use the ``radio.onFireflyCorrection`` event to run 
when a tick correction was applied

```blocks
radio.onFireflyCorrection(function () {
    console.log('correction')
})
```

### ``setFireflyInterval``

You can change the interval of the sync event using this block.

```blocks
radio.setFireflyInterval(1000)
```