var Queue = function() {
    this.queue = [];
    this.running = false;
};

Queue.prototype.add = function(action) {
    this.queue.push(action);
    if (!this.running) {
        this.running = true;
        this.queue[0].run();
    }
};
Queue.prototype.shift = function() {
    this.queue.shift();
    if (this.queue.length === 0) {
        this.running = false;
        return;
    }
    this.queue[0].run();
};
