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

            } else {
                // Build up the values
                let result = document.createElement('div');
                result.innerHTML = `<div>ID: ${value.id} - Phone: ${value.phone} - Result: ${value.result}</div><br>`;

                // Append to the target
                targetDiv.appendChild(result);

                // Recursively call
                writeToDOM(reader);
            }
        },
        e => console.error("The stream became errored and cannot be read from!", e)
    );
}

/**
 * Fetch and process the stream
 */
async function process() {
    // Retrieve NDJSON from the server
    const response = await fetch('http://localhost:3000/request');

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

process();