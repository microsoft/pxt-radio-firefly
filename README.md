# Radio Firefly

This extension provides a firefly-like protocol to synchronize
devices together.

## Usage

### ``onFirefly`` 

Use the ``radio.onFireflySync`` event to register code that
will run synchronized

```blocks
radio.onFireflySync(function () {
    console.log('ping')
})
```

### ``setFireflyInterval``

You can change the interval of the sync event using this block.

```blocks
radio.setFireflyInterval(1000)
```