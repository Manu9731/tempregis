import fs from "fs"

//Check If File Exists or not

async function checkFileExists(path) {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            resolve(!err); // Resolves with true if file exists, false otherwise
        });
    });
}


//Write into the file

async function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                return reject(new Error("Error writing to file"));
            }
            resolve("File updated successfully")
        });
    });
}


//Updatecontents into the config.json file

async function updateContents(path, actualContent, res, status, message){
    const ifFileExists = await checkFileExists(path)
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", async (err, data) => {
            if (err) {
                return reject(new Error("Error reading the file"));
            }
    
            try {
                const readData = JSON.parse(data);
                // console.log(readData)
                const keys = Object.keys(JSON.parse(actualContent));
                if (keys.length > 1) {
                    readData[keys[1]] = JSON.parse(actualContent)[keys[1]];
                }
                await writeFile(path, readData);
                res.status(status).send(message);
                resolve("File updated successfully");
            } catch (parseError) {
                res.status(500).send("Error parsing JSON");
            }
        });
    });
    
}

export {updateContents, checkFileExists}

