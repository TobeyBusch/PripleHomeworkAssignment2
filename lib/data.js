/*
* Library used for storing and editing data
*
*/

// Dependencies
const fs = require('fs');
const path = require('path');

//Container for the module (to be exported)
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Write data to a file
lib.create = function(dir,file,data,callback){
    // Open the file for writing 
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
       if(!err && fileDescriptor){
           // Convert data to a string
           let stringData = JSON.stringify(data);
           
           //Write to file
           fs.writeFile(fileDescriptor,stringData,function(err){
               if(!err){
                   fs.close(fileDescriptor,function(err){
                       if(!err){
                           callback(false);
                       }
                       else{
                           callback('Error closing new file')
                       }
                   })
               } else {
                   callback('Error writing to new file')
               }
           })
       } else {
           callback('Could not create new file, it may already exist');
       }
    });
};

// Read data from a file
lib.read = function(dir, file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    });
};

// Update data inside a file
lib.update = function(dir,file,data,callback){
    // Open the file for writing 
    let filePath = lib.baseDir+dir+'/'+file+'.json';
    
    fs.open(filePath,'r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            // Convert the data to a string
            let stringData = JSON.stringify(data);
            
            // Truncate the file
            fs.truncate(filePath,0,function(err){
                if(!err){
                    // Write to the file and close it
                    fs.writeFile(filePath,stringData,function(err){
                        if(!err){
                            fs.close(fileDescriptor,function(err){
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('Error closing file.')
                                }
                            })
                        } else {
                            callback('Error writing to existing file');
                        }
                    })
                }
                else {
                    callback('Error truncating file');
                }
            })
        } else{
            callback('Could not open the file for updating, it may not exist yet');
        }
    })
};

// Delete a file
lib.delete = function(dir,file,callback){
    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        } else
            callback('Error trying to delete the file');
    });
};

// Export the module
module.exports = lib;