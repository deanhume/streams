const targetDiv = document.querySelector('#target');
const barFill = document.querySelector("#bar-fill");


/**
 * Split the stream
 * @param {*} splitOn 
 */
function splitStream(splitOn) {
    let buffer = '';

    return new TransformStream({
        transform(chunk, controller) {
            buffer += chunk;
            const parts = buffer.split(splitOn);
            parts.slice(0, -1).forEach(part => controller.enqueue(part));
            buffer = parts[parts.length - 1];
        },
        flush(controller) {
            if (buffer) controller.enqueue(buffer);
        }
    });
}

/**
 * Parse the NDJSON results
 */
function parseJSON() {
    return new TransformStream({
        transform(chunk, controller) {
            controller.enqueue(JSON.parse(chunk));
        }
    });
}

/**
 * Read through the results and write to the DOM
 * @param {object} reader 
 */
function writeToDOM(reader) {
    reader.read().then(
        ({ value, done }) => {
            if (done) {
                console.log("The stream was already closed!");
                barFill.style.background = "green";

            } else {
                targetDiv.innerHTML += `ID: ${value.id} - Phone: ${value.phone} - Result: ${value.result}<br>`;

                updateProgressBar();

                // Recursively call
                writeToDOM(reader);
            }
        },
        e => console.error("The stream became errored and cannot be read from!", e)
    );
}

/**
 * Adapted from https://github.com/TejasQ/basically-streams/blob/master/examples/fetch/index.js
 */
function updateProgressBar(value) {
    // Initialize how much we've received. Nothing so far.
    let received = 0;

    // If it's not done, increment the received variable, and the bar's fill.
    received += value.length;
    barFill.style.width = `${received / length * 100}%`;
}

/**
 * Fetch and process the stream
 */
async function process() {
    // Retrieve NDJSON from the server
    const response = await fetch('http://localhost:3000/request');

    // Find out how big the response is.
    const length = response.headers.get("Content-Length");

    const results = response.body
        // // From bytes to text:
        .pipeThrough(new TextDecoderStream())
        // Buffer until newlines:
        .pipeThrough(splitStream('\n'))
        // Parse chunks as JSON:
        .pipeThrough(parseJSON());

    // Loop through the results and write to the DOM
    writeToDOM(results.getReader());
}

// Progress Bar
barFill.style.width = 0;
barFill.style.background = "red";

process();