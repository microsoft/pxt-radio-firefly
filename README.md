# Radio Firefly

This extension provides a firefly-like protocol to synchronize
devices together.

## Usage

### ``onSync`` 

Use the ``firefly.onSync`` event that is raised
on each clock cycle.

```blocks
firefly.onSync(function () {
    console.log('sync')
})
```

### ``onTick`` 

Use the ``firefly.onTick`` event to run on each tick

```blocks
firefly.onTick(function () {
    console.log('tick')
})
```

### ``onCorrection`` 

Use the ``firefly.onCorrection`` event to run 
when a tick correction was applied

```blocks
firefly.onCorrection(function () {
    console.log('correction')
})
```

### ``setInterval``

You can change the interval of the sync event using this block.

```blocks
firefly.setInterval(1000)
```

### ``hasNeighbors``

Indicates if any signal was received from neighboring devices
during the clock cycle.

```blocks
firefly.onSync(function () {
    if (firefly.hasNeighbors()) {
        console.log('sync')
    }
})
```

## Metadata

* for PXT/microbit

